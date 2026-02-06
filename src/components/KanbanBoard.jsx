import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';

const columns = {
    'open': { title: 'Open', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800' },
    'in progress': { title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
    'review': { title: 'Review', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
    'closed': { title: 'Closed', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700' }
};

export default function KanbanBoard({ onEdit }) {
    const [issues, setIssues] = useState([]);
    const [boardData, setBoardData] = useState({
        'open': [],
        'in progress': [],
        'review': [],
        'closed': []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchIssues();
    }, []);

    const fetchIssues = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/issues');
            const data = response.data;
            setIssues(data);
            distributeIssues(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching issues:", error);
            setLoading(false);
        }
    };

    const distributeIssues = (issueList) => {
        const newBoard = {
            'open': [],
            'in progress': [],
            'review': [],
            'closed': []
        };

        issueList.forEach(issue => {
            const status = issue.status?.toLowerCase() || 'open';
            // Normalize status to board keys
            let key = 'open';
            if (status.includes('progress')) key = 'in progress';
            else if (status.includes('review')) key = 'review';
            else if (status.includes('closed')) key = 'closed';
            else key = 'open';

            if (newBoard[key]) {
                newBoard[key].push(issue);
            } else {
                newBoard['open'].push(issue);
            }
        });
        setBoardData(newBoard);
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        // Optimistic update
        const sourceColId = source.droppableId;
        const destColId = destination.droppableId;
        
        const sourceCol = [...boardData[sourceColId]];
        const destCol = [...boardData[destColId]];
        
        const [movedIssue] = sourceCol.splice(source.index, 1);
        
        // Update issue status locally object
        let updatedIssue = { ...movedIssue, status: columns[destColId].title };

        // Auto-promote to High priority if moved to the top of the list
        if (destination.index === 0) {
            updatedIssue.priority = 'High';
        }
        
        if (sourceColId === destColId) {
            sourceCol.splice(destination.index, 0, updatedIssue);
            setBoardData({
                ...boardData,
                [sourceColId]: sourceCol
            });
        } else {
            destCol.splice(destination.index, 0, updatedIssue);
            setBoardData({
                ...boardData,
                [sourceColId]: sourceCol,
                [destColId]: destCol
            });

            // API Call
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:8080/api/issues/${movedIssue.id}`, 
                    updatedIssue,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.error("Error updating status:", error);
                alert("Failed to update status. Reverting...");
                fetchIssues(); // Revert on error
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Loop...</div>;

    return (
        <div className="h-full overflow-x-auto pb-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 min-w-[1000px] h-full">
                    {Object.entries(columns).map(([colId, colDef]) => (
                        <div key={colId} className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 h-full max-h-[calc(100vh-12rem)]">
                            <div className={`p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800 rounded-t-2xl sticky top-0 z-10`}>
                                <h3 className="font-bold text-slate-700 dark:text-slate-200">{colDef.title}</h3>
                                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold px-2 py-1 rounded-full">
                                    {boardData[colId].length}
                                </span>
                            </div>
                            
                            <Droppable droppableId={colId}>
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex-1 p-4 space-y-3 overflow-y-auto transition-colors ${snapshot.isDraggingOver ? 'bg-slate-200/50 dark:bg-slate-700/50' : ''}`}
                                    >
                                        {boardData[colId].map((issue, index) => (
                                            <Draggable key={issue.id.toString()} draggableId={issue.id.toString()} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        onClick={() => onEdit(issue)}
                                                        className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow group cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-primary-500 z-50' : ''}`}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="text-xs font-mono text-slate-400">#{issue.id}</span>
                                                            <div className={`w-2 h-2 rounded-full ${colDef.color.split(' ')[0]}`}></div>
                                                        </div>
                                                        <h4 className="font-medium text-slate-800 dark:text-slate-200 text-sm mb-2 line-clamp-2 md:line-clamp-none">{issue.title}</h4>
                                                        <div className="flex items-center justify-between mt-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs">👤</div>
                                                                <span className="text-xs text-slate-500">{issue.priority}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}

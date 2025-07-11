import { useEffect, useState } from "react";
import Column from "../components/Column";
import type { ColumnType } from "../types";
import type { CardType } from "../types";
import { useAuth } from "../context/AuthContext";
import { DndContext, closestCenter, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

const colors = [
    "blue-grey darken-1", 
    "teal darken-2", 
    "purple darken-2", 
    "orange darken-1",
    "red bright-1",
    "blue bright-1"
]

const BoardPage = () => {
    const { user } = useAuth();
    const [columns, setColumns] = useState<ColumnType[]>([]);
    const [newColumnName, setNewColumnName] = useState("");
    const [newColumnColor, setNewColumnColor] = useState("blue-grey darken-1");
    const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [newCardHeader, setNewCardHeader] = useState("");
    const [newCardContent, setNewCardContent] = useState("");
    const [newCardEstimate, setNewCardEstimate] = useState("");
    const [editCardId, setEditCardId] = useState<string | null>(null);
    const [activeCard, setActiveCard] = useState<CardType | null>(null);
    

    useEffect(() => {
        // fetches the board 
        async function fetchBoard() {
        try {
            const response = await fetch("http://localhost:3001/api/board", {
                headers: { Authorization: user?.token ?? "" },
            });

            const data = await response.json();

            if (response.ok) {
                setColumns(data.columns || []);
            } else {
                setError(data.error || "Failed to fetch board");
            }
        } catch (err) {
            setError("Server error");
        }
    }
        fetchBoard();
    }, [user?.token ?? ""]);
    //saves the board to the database 
    async function saveBoard(updated: ColumnType[]) {
        const response = await fetch("http://localhost:3001/api/board", {
            method: "POST",
            headers: {
                Authorization: user?.token ?? "",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ columns: updated }),
        });

        if (response.ok) {
            setColumns(updated);
        } else {
            const err = await response.json();
            setError(err.error || "Failed to save board.");
        }
    }
    //used for opening modals
    useEffect(() => {
        const elems = document.querySelectorAll(".modal");
        M.Modal.init(elems);
    }, []);
    //Adding new column 
    function addNewColumn() {
        const trimmed = newColumnName.trim();
        if (!trimmed) return;

        const newCol: ColumnType = {
            id: crypto.randomUUID(),
            name: trimmed,
            color: newColumnColor,
            cards: [],
        };

        const updated = [...columns, newCol];
        setColumns(updated);
        saveBoard(updated);
        setNewColumnName("");
        setSelectedColumnId(null);
        const modal = M.Modal.getInstance(document.getElementById("create-column-modal")!);
        modal.close();
    }
    //Deletes a selected column
    function deleteColumn(id: string) {
        const updated = columns.filter(col => col.id !== id);
        setColumns(updated);
        saveBoard(updated);
    }
    // adds a new card to a selected column, not used when moving cards around
    function addCardToColumn() {
        if (!selectedColumnId) return;

        const trimmedHeader = newCardHeader.trim();
        const trimmedContent = newCardContent.trim();
        if (!trimmedHeader || !trimmedContent) return;

        const newCard = {
            id: crypto.randomUUID(),
            header: trimmedHeader,
            content: trimmedContent,
            color: newColumnColor,
            estimatedTime: newCardEstimate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const updated = columns.map(col =>
            col.id === selectedColumnId ? { ...col, cards: [...col.cards, newCard] } : col
        )
        
        setColumns(updated);
        saveBoard(updated);
        setNewCardHeader("");
        setNewCardContent("");
        setNewCardEstimate("");
        setSelectedColumnId(null);
        const modal = M.Modal.getInstance(document.getElementById("create-card-modal")!)
        modal.close()
    }
    //opens a modal where you can create a new card
    function openCreateCardModal(columnId: string) {
        setSelectedColumnId(columnId);
        setNewCardHeader("");
        setNewCardContent("");
        setNewCardEstimate("");
        const modal = M.Modal.getInstance(document.getElementById("create-card-modal")!);
        modal.open() 
    }
    //opens a modal where you can customize existing column
    function openCustomizeModal(columnId: string) {
        setSelectedColumnId(columnId);
        const col = columns.find(c => c.id === columnId);
        if (!col) {
            return
        }
        setNewColumnName(col?.name);
        const modal = M.Modal.getInstance(document.getElementById("customize-column-modal")!);
        modal.open();
    }
    //Applies customization done in modal to column
    function applyCustomizeColumn() {
        if (!selectedColumnId) return;

        const updated = columns.map(col =>
            col.id === selectedColumnId ? { ...col, name: newColumnName, color: newColumnColor } : col
        );

        setColumns(updated);
        saveBoard(updated);
        setSelectedColumnId(null);
        const modal = M.Modal.getInstance(document.getElementById("customize-column-modal")!);
        modal.close();
    }
    //opens a modal where you can customize existing card
    function openEditCardModal(columnId: string, cardId: string) {
        const column = columns.find(c => c.id === columnId);
        const card = column?.cards.find(c => c.id === cardId);
        if (!card) return;

        setSelectedColumnId(columnId);
        setEditCardId(cardId);
        setNewCardHeader(card.header);
        setNewCardContent(card.content);
        setNewCardEstimate(card.estimatedTime);
        setNewColumnColor(card.color);

        const modal = M.Modal.getInstance(document.getElementById("edit-card-modal")!);
        modal.open();
    }
    //Applies customization done in modal to card
    function editCard() {
        if (!selectedColumnId || !editCardId) return 

        const updated = columns.map(col => {
            if (col.id !== selectedColumnId) return col 

            const updatedCards = col.cards.map(card =>
                card.id === editCardId
                    ? {
                        ...card,
                        header: newCardHeader.trim(),
                        content: newCardContent.trim(),
                        color: newColumnColor,
                        estimatedTime: newCardEstimate.trim(),
                        updatedAt: new Date().toISOString(),
                    } : card
            );

            return { ...col, cards: updatedCards };
        });

        setColumns(updated);
        saveBoard(updated);

        setEditCardId(null);
        setNewCardHeader("");
        setNewCardContent("");
        setNewCardEstimate("");

        const modal = M.Modal.getInstance(document.getElementById("edit-card-modal")!);
        modal.close();
    }
    // deletes a selected card
    function deleteCard(columnId: string, cardId: string) {
        const updated = columns.map(col => {
            if (col.id !== columnId) return col;
            return {
                ...col,
                cards: col.cards.filter(card => card.id !== cardId)
            };
        });

        setColumns(updated);
        saveBoard(updated);
    }
    // starts drag and dropfunctionality
    function handleDragStart(event: DragStartEvent) {
        const { active } = event;
        const [columnId, cardId] = active.id.toString().split(":");
        const column = columns.find(c => c.id === columnId);
        const card = column?.cards.find(c => c.id === cardId);
        if (card) {
            setActiveCard(card);
        }
    }
    // looks at the end state of drag and drop and makes those changes to the board
    function handleDragEnd(event: DragEndEvent) {
        // Clear active card state which is given in handleDragStart
        setActiveCard(null);
        const { active, over } = event;

        if (!active || !over) return;

        const [sourceColumnId, cardId] = active.id.toString().split(":");
        const overIdParts = over.id.toString().split(":");
        const targetColumnId = overIdParts[0];
        const overCardId = overIdParts[1];

        if (!sourceColumnId || !cardId || !targetColumnId) return;

        //If dropping card into the place you took it from nothing happens
        if (sourceColumnId === targetColumnId && cardId === overCardId) {
            return;
        }

        // find source and target columns and the card that is moving
        const sourceColumn = columns.find(c => c.id === sourceColumnId);
        const targetColumn = columns.find(c => c.id === targetColumnId);
        const cardToMove = sourceColumn?.cards.find(c => c.id === cardId);

        if (!sourceColumn || !cardToMove) return;

        const sourceCards = [...sourceColumn.cards.filter(c => c.id !== cardId)];

        //Reordering cards inside one column
        if (sourceColumnId === targetColumnId) { 
            const targetIndex = sourceCards.findIndex(c => c.id === overCardId);

            //if dropped below all cards, insert at bottom
            const insertAt = targetIndex === -1 ? sourceCards.length : targetIndex;

            // Insert card at the new index
            sourceCards.splice(insertAt, 0, cardToMove);

            
            const updated = columns.map(col =>
                col.id === sourceColumnId ? { ...col, cards: sourceCards }: col
            );

            setColumns(updated);
            saveBoard(updated);
            return;
        }

        
        if (!targetColumn) return;

        // Copy cards from target column
        const newTargetCards = [...targetColumn.cards];
        const insertAt = overCardId 
            ? newTargetCards.findIndex(c => c.id === overCardId)
            : newTargetCards.length;

        newTargetCards.splice(insertAt, 0, cardToMove);

        const updated = columns.map(col => {
            if (col.id == sourceColumnId) {
                return {
                    ...col,
                    cards: col.cards.filter(c => c.id !== cardId)
                };
            }
            if (col.id === targetColumnId) {
                return {
                    ...col, cards: newTargetCards
                };
            }
            return col;
        });

        setColumns(updated);
        saveBoard(updated);
    }
    //functionality for column to switch position to left
    function moveColumnLeft(columnId: string) {
        const index = columns.findIndex(col => col.id === columnId);
        if (index > 0) {
            const newColumns = [...columns];
            [newColumns[index-1], newColumns[index]] = [newColumns[index], newColumns[index - 1]];
            setColumns(newColumns);
            saveBoard(newColumns);
        }
    }
    //functionality for column to switch position to right
    function moveColumnRight(columnId: string) {
        const index = columns.findIndex(col => col.id === columnId);
        if (index < columns.length - 1) {
            const newColumns = [...columns];
            [newColumns[index], newColumns[index + 1]] = [newColumns[index + 1], newColumns[index]];
            setColumns(newColumns);
            saveBoard(newColumns);
        }
    }

    const sensors = useSensors (
        useSensor(PointerSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    return (
        <div className="container">
            <h4>Your Board</h4>

            <div className="fixed-action-btn" style={{ bottom: "24px", right: "24px", position: "fixed" }}>
                <a className="btn-floating btn-large purple modal-trigger" data-target="create-column-modal">
                    <i className="material-icons">add</i>
                </a>
            </div>

            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                sensors={sensors}
            >
                <SortableContext
                    items={columns.flatMap(col =>
                        col.cards.map(card => `${col.id}:${card.id}`)
                    )}
                    strategy={rectSortingStrategy}
                >
                    <div style={{ display: "flex", overflowX: "auto", marginTop: "20px" }}>
                        {columns.map((col, i) => (
                            <Column
                                key={col.id}
                                id={col.id}
                                name={col.name}
                                color={col.color}
                                cards={col.cards}
                                onAddCard={openCreateCardModal}
                                onDeleteColumn={() => deleteColumn(col.id)}
                                onOpenCustomizeModal={openCustomizeModal}
                                onEditCard={(cardId) => openEditCardModal(col.id, cardId)}
                                onDeleteCard={(cardId) => deleteCard(col.id, cardId)}
                                onMoveLeft={() => moveColumnLeft(col.id)}
                                onMoveRight={() => moveColumnRight(col.id)}
                                isFirst={i === 0}
                                isLast={i === columns.length - 1}
                            />
                        ))}
                    </div>
                </SortableContext>
            <DragOverlay>
                {activeCard && (
                    <div className={`card ${activeCard.color}`} style={{ padding: "10px" }}>
                        <strong>{activeCard.header}</strong>
                        <div>{activeCard.content}</div>
                    </div>
                )}
            </DragOverlay>
            </DndContext>

            {/* Modal for creating a column */}
            <div id="create-column-modal" className="modal">
                <div className="modal-content">
                    <h5>Create New Column</h5>
                    <input
                        type="text"
                        placeholder="Column Name"
                        value={newColumnName}
                        onChange={e => setNewColumnName(e.target.value)}
                    />
                    <h6>Pick a color:</h6>
                    <div className="row">
                        {colors.map(color => (
                            <div
                                key={color}
                                className={`col s4 card ${color}`}
                                style={{
                                    height: "50px",
                                    cursor: "pointer",
                                    border: newColumnColor === color ? "3px solid white" : "none"
                                }}
                                onClick={() => setNewColumnColor(color)}
                            />
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={addNewColumn}>Create</button>
                </div>
            </div>

            {/* Modal for customizing a column */}
            <div id="customize-column-modal" className="modal">
                <div className="modal-content">
                    <h5>Customize Column</h5>
                    <h6>Change column name:</h6>
                    <input
                        type="text"
                        placeholder="Column Name"
                        value={newColumnName}
                        onChange={e => setNewColumnName(e.target.value)}
                    />

                    <h6>Pick a new color:</h6>
                    <div className="row">
                        {colors.map(color => (
                            <div
                                key={color}
                                className={`col s4 card ${color}`}
                                style={{
                                    height: "50px",
                                    cursor: "pointer",
                                    border: newColumnColor === color ? "3px solid white" : "none"
                                }}
                                onClick={() => setNewColumnColor(color)}
                            />
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={applyCustomizeColumn}>Apply</button>
                </div>
            </div>
            {/* Modal creating a new card */}
            <div id="create-card-modal" className="modal">
                <div className="modal-content">
                    <h5>Create New Card</h5>
                    
                    <input
                        id="cardHeaderInput"
                        type="text"
                        placeholder="Card Header"
                        value={newCardHeader}
                        onChange={e => setNewCardHeader(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Card Content"
                        value={newCardContent}
                        onChange={e => setNewCardContent(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Estimated Time of completion (e.g., 2h, 1d, 3w)"
                        value={newCardEstimate}
                        onChange={e => setNewCardEstimate(e.target.value)}
                    />              
                    <h6>Pick a color:</h6>
                    <div className="row">
                        {colors.map(color => (
                            <div
                                key={color}
                                className={`col s4 card ${color}`}
                                style={{
                                    height: "50px",
                                    cursor: "pointer",
                                    border: newColumnColor === color ? "3px solid white" : "none"
                                }}
                                onClick={() => setNewColumnColor(color)}
                            />
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={addCardToColumn}>Create</button>
                </div>
            </div>
            {/* Modal to edit a card */}
            <div id="edit-card-modal" className="modal">
                <div className="modal-content">
                    <h5>Edit Card</h5>
                    <input
                        type="text"
                        placeholder="Card Header"
                        value={newCardHeader}
                        onChange={e => setNewCardHeader(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Card Content"
                        value={newCardContent}
                        onChange={e => setNewCardContent(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Estimated time of completion"
                        value={newCardEstimate}
                        onChange={e => setNewCardEstimate(e.target.value)}
                    />
                    <h6>Pick a color:</h6>
                    <div className="row">
                        {colors.map(color => (
                            <div
                                key={color}
                                className={`col s4 card ${color}`}
                                style={{
                                    height: "50px",
                                    cursor: "pointer",
                                    border: newColumnColor === color ? "3px solid white" : "none"
                                }}
                                onClick={() => setNewColumnColor(color)}
                            />
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn" onClick={editCard}>Save</button>
                </div>
            </div>

            {error && <div className="red-text">{error}</div>}
        </div>
    );
};

export default BoardPage;

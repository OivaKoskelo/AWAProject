import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import type { CardType } from "../types";

interface Props {
    card: CardType;
    columnId: string;
    onEditCard:(id: string) => void;
    onDeleteCard: (id: string) => void;
}


const Card = ({ card, columnId, onEditCard, onDeleteCard }: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: `${columnId}:${card.id}`,
    });
    //styling for the whole card
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        padding: "10px",
        marginBottom: "10px",
    };
    
    return (
        <div ref={setNodeRef}  className={`card ${card.color}`} style={style}>
            <div 
                /* Draggable part of the cards */
                {...attributes} 
                {...listeners} 
                style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    fontWeight: "bold", 
                    fontSize: "1.2rem", 
                    marginBottom: "5px", 
                    cursor: "grab", 
                    userSelect: "none" 
                }}
            >
                <i className="material-icons small">drag_indicator</i>
                {card.header}
            </div>

            <div style={{ marginBottom: "10px", whiteSpace: "pre-wrap" }}>
                {card.content}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Bottom Left side: Times */}
                <div style={{ fontSize: "0.85rem" }}>
                    <div>Est: {card.estimatedTime || "-"}</div>
                    <div>Created: {new Date(card.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}</div>
                    <div>Latest edit: {new Date(card.updatedAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}</div>
                </div>
                {/* Bottom Right side: Icons to edit a card or delete a card */}
                <div>
                    <i
                        className="material-icons small"
                        style={{ cursor: "pointer", marginRight: "8px" }}
                        onClick={() => onEditCard(card.id)}
                        title="Edit"
                    >
                        edit
                    </i>
                    <i
                        className="material-icons small"
                        style={{ cursor: "pointer" }}
                        onClick={() => onDeleteCard(card.id)}
                        title="Delete"
                    >
                        delete
                    </i>
                </div>
            </div>
        </div>
    );
};


export default Card;
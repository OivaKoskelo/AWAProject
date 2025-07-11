import type { CardType } from "../types";
import ColumnHeader from "./ColumnHeader";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Card from "./CardItem";

interface Props {
    id: string;
    name: string;
    color: string;
    cards: CardType[];
    onAddCard: (id: string) => void;
    onDeleteColumn: () => void;
    onOpenCustomizeModal: (id: string) => void;
    onEditCard: (cardId: string) => void;
    onDeleteCard: (cardId: string) => void;
    onMoveLeft: () => void;
    onMoveRight: () => void;
    isFirst: boolean;
    isLast: boolean;
}

const Column = ({
    id,
    name,
    color,
    cards,
    onAddCard,
    onDeleteColumn,
    onOpenCustomizeModal,
    onEditCard,
    onDeleteCard,
    onMoveLeft,
    onMoveRight,
    isFirst,
    isLast
}: Props) => {

    const { setNodeRef: setColumnRef } = useDroppable({
        id,
    });
    /* Dividing column into essentially 3 pars Header, Content(cards) and the arrows to move columns around*/
    return (
        <div ref={setColumnRef}>
            <div className={`card ${color}`} style={{ minWidth: "300px", marginRight: "16px" }}>
                <div className="card-content white-text">
                    <ColumnHeader
                        name={name}
                        columnId={id}
                        onAddCard={onAddCard}
                        onDeleteColumn={onDeleteColumn}
                        onOpenCustomizeModal={onOpenCustomizeModal}
                    />

                    <ul>
                        <SortableContext
                            items={cards.map(card => `${id}:${card.id}`)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div style={{ height: "5px" }} /> {/* Giving extra room to drop cards into */}
                            {cards.map((card) => (
                                <Card
                                    key={card.id}
                                    card={card}
                                    columnId={id}
                                    onEditCard={onEditCard}
                                    onDeleteCard={onDeleteCard}
                                />
                            ))}
                            <div style={{ height: "10px" }} /> {/* Giving extra room to drop cards into */}
                        </SortableContext> 
                    </ul>
                    
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "10px",  }}>
                        <button
                            className="btn-flat"
                            onClick={onMoveLeft}
                            disabled={isFirst}
                            title="Move Left"
                            style={{ visibility: isFirst ? "hidden" : "visible", color: "white" }}
                        >
                            <i className="material-icons">arrow_backward</i>
                        </button>
                        <button
                            className="btn-flat"
                            onClick={onMoveRight}
                            disabled={isLast}
                            title="Move Right"
                            style={{ visibility: isLast ? "hidden" : "visible", color: "white" }}
                        >
                            <i className="material-icons">arrow_forward</i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Column;

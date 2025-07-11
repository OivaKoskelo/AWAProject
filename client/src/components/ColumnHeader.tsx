import { useEffect } from "react";

interface Props {
    name: string;
    columnId: string;
    onAddCard: (columnId: string) => void;
    onDeleteColumn: () => void;
    onOpenCustomizeModal: (columnId: string) => void;
}

const ColumnHeader = ({
    name,
    columnId,
    onAddCard,
    onDeleteColumn,
    onOpenCustomizeModal,
}: Props) => {
    useEffect(() => {
        const elems = document.querySelectorAll(".dropdown-trigger");
        M.Dropdown.init(elems, {
            constrainWidth: false,
            alignment: "left",
            onOpenStart: () => {},
            onOpenEnd: () => {},
            onCloseStart: () => {},
            onCloseEnd: () => {},
            coverTrigger: true,
            closeOnClick: true,
        });
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="card-title">{name}</span>
            {/* Dropdown menu */}
            <a
                className="dropdown-trigger white-text"
                href="#!"
                data-target={`dropdown-${columnId}`}
                style={{ cursor: "pointer" }}
            >
                <i className="material-icons">more_vert</i>
            </a>

            <ul id={`dropdown-${columnId}`} className="dropdown-content">
                <li>
                    <a href="#!" onClick={()  => onAddCard(columnId)}>Add new card</a>
                </li>
                <li>
                    <a href="#!" onClick={() => onOpenCustomizeModal(columnId)}>
                        Customize column
                    </a>
                </li>
                <li>
                    <a href="#!" onClick={onDeleteColumn} className="red-text">
                        Remove column
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default ColumnHeader;

import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { DndTreeProvider } from "./context";
import { DndTreeItem, DndTreePassthrough } from "./defs";


/**
 * Properties expected by the TreeView component.
 */
export interface DndTreeContextProps<TData, TItem>
    extends DndTreePassthrough<TData, TItem> {
    /**
     * The children are simply nexted inside the context.
     */
    children?: ReactNode;
}


/**
 * The controller part of the tree-view.
 * 
 * TODO: test that get* cannot be changed after initiall render; document this.
 */
export function DndTreeController<TData, TItem>({
    children,
    data,
    getNodeExpanded,
    getNodeChildren,
    getNodeId,
    getNodeContent,
    getNodeChildrenCount,
}: DndTreeContextProps<TData, TItem>) {
    console.log("[DndTreeController] data %O", data);

    // This is where we store the flat list of items.
    const [flat, setFlat] = useState<DndTreeItem<TItem>[]>(
        () => convertTreeToFlat(data)
    );


    // Whenever the data changes we recompute the flat list.
    useEffect(() => {
        setFlat(convertTreeToFlat(data))
    }, [data])


    // The sensors we use for drag-n-drop.
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );


    // We are informed here that a drag opperation was completed.
    const handleOnDragEnd = useCallback((event: DragEndEvent) => {
        console.log("[DndTreeController.handleOnDragEnd] event %O", event);

        const { active, over } = event;
        

    }, []);


    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleOnDragEnd}
        >
            <DndTreeProvider
                value={{
                    data,
                    flat,
                    getNodeExpanded,
                    getNodeChildren,
                    getNodeId,
                    getNodeContent,
                    getNodeChildrenCount,
                }}
            >
                <SortableContext
                    items={flat}
                    strategy={verticalListSortingStrategy}
                >
                    {children}
                </SortableContext>
            </DndTreeProvider>
        </DndContext>
    );


    // Create an inner item for this user item and all of its children.
    function convertNodeToFlat(
        result: DndTreeItem<TItem>[],
        item: TItem | null,
        parent: DndTreeItem<TItem> | null,
        level: number
    ): number {
        console.log(
            "[DndTreeController.convertNodeToFlat] result %O item %O parent %O level %O",
            result, item, parent, level
        );
        let counter = 0;
        const c = getNodeChildren(data, item);
        console.log(
            "[DndTreeController.convertNodeToFlat] getNodeChildren %O", c
        );
        c.forEach(source => {
            console.log(
                "[DndTreeController.convertNodeToFlat] forEach source %O counter %O",
                source, counter
            );
            if (!source) {
                return;
            }
            counter = counter + 1;
            const newItem = {
                id: getNodeId(data, source),
                parent,
                collapsed: !getNodeExpanded(data, source),
                level,
                source,
                children: 0,
            };
            result.push(newItem);
            console.log(
                "[DndTreeController.convertNodeToFlat] newItem %O",
                newItem
            );

            if (!newItem.collapsed) {
                newItem.children = convertNodeToFlat(
                    result, source, newItem, level + 1
                );
            } else {
                newItem.children = getNodeChildrenCount(data, source);
            }
        })
        return counter;
    }


    // Convert a tree of items to a flat list of items that
    // are visible based on their expanded/collapsed state.
    function convertTreeToFlat(v: TData): DndTreeItem<TItem>[] {
        const result: DndTreeItem<TItem>[] = [];
        convertNodeToFlat(result, null, null, 0);
        return result;
    }
}

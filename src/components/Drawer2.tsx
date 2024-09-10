import React from "react";
import { Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";

interface Props extends React.HTMLProps<HTMLDivElement> {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

const CustomDrawer: React.FC<Props> = ({ ...props }) => {
    return (
        <Modal
            scrollBehavior="inside"
            isOpen={props.isOpen}
            onOpenChange={props.onOpenChange}
            placement="center"
            backdrop="opaque"
            size="full"
            classNames={{
                wrapper: "flex justify-end",
            }}
            motionProps={{
                variants: {
                    enter: {
                        x: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        x: 50,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                }
            }}
            className="rounded-md max-w-sm w-full h-screen max-h-screen">
            <ModalContent>{(onClose) => <>{props.children}</>}</ModalContent>
        </Modal>
    );
};

export default CustomDrawer;

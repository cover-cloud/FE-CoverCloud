"use client";
import { ReactNode } from "react";
import { Dialog } from "@mui/material";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-lg relative">
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          x
        </button>
      </div>
    </Dialog>
  );
}

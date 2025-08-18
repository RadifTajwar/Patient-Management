import React from "react";
import { useToast } from "@/hooks/use-toast";
import Spinner from "./Spinner";
import { Note } from "../pages/NotesPage";
import NoteItem from "./NoteItem";

interface NoteListProps {
  notes: Note[];
  onViewDetails: (id: number) => void;
  isLoading: boolean;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  onViewDetails,
  isLoading = false,
}) => {
  const { toast } = useToast();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size={50} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes.length === 0 ? (
        isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size={50} />
          </div>
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No Notes Found</p>
          </div>
        )
      ) : (
        notes.map((note) => (
          <NoteItem key={note.id} {...note} onViewDetails={onViewDetails} />
        ))
      )}
    </div>
  );
};

export default NoteList;

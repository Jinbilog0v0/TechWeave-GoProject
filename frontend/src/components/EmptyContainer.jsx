// src/components/EmptyContainer.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconFolderCode } from "@tabler/icons-react"; // Default fallback
import { ArrowUpRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

const EmptyContainer = ({
  title = "No Activities yet",
  description = "No activities have been created yet.",
  showLearnMore = false,
  onCreate,
  // New prop: accept a component (Capitalized because it's a component)
  icon: Icon = IconFolderCode, 
}) => {
  const navigate = useNavigate();

  const handleDefaultClick = () => {
    navigate("/personalworkspace");
  };

  return (
    // Added h-full and flex-col to ensure it centers vertically in the parent
    <Empty className="h-full flex flex-col justify-center items-center text-center p-8">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {/* Use the passed Icon */}
          <Icon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        </EmptyMedia>
        <EmptyTitle className="text-xl font-semibold">{title}</EmptyTitle>
        <EmptyDescription className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">
          {description}
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="mt-6">
        <div className="flex gap-2 justify-center">
          <Button 
            onClick={onCreate || handleDefaultClick} 
            className="bg-green-700 text-white hover:bg-green-800"
          >
            {onCreate ? "Create New" : "Get Started"}
          </Button>
        </div>
      </EmptyContent>

      {showLearnMore && (
        <div className="mt-4">
            <Button variant="link" asChild className="text-muted-foreground" size="sm">
            <Link to="/about" className="flex items-center gap-1">
                Learn More <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
            </Button>
        </div>
      )}
    </Empty>
  );
};

export default EmptyContainer;
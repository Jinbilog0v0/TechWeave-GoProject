import React from "react";
import { Link } from "react-router-dom";
import { IconFolderCode } from "@tabler/icons-react";
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

const EmptyProjects = ({
  onCreate,
  title = "No Projects Yet",
  description = "You haven’t created any projects yet. Get started by creating your first project.",
  showLearnMore = false, // optional Learn More link
}) => {
  return (
    <Empty className="text-center">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconFolderCode />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <div className="flex gap-2 justify-center">
          {onCreate && (
            <Button onClick={onCreate} className="bg-green-700 text-white">
              Create Project
            </Button>
          )}
        </div>
      </EmptyContent>

      {showLearnMore && (
        <Button variant="link" asChild className="text-muted-foreground" size="sm">
          <Link to="/about">
            Learn More <ArrowUpRightIcon />
          </Link>
        </Button>
      )}
    </Empty>
  );
};

export default EmptyProjects;

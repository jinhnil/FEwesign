"use client";

import React from "react";
import { useParams } from "next/navigation";
import StudentProcess from "./StudentStatisticsProcess";

const StudentProcessWrapper: React.FC = () => {
  const params = useParams();
  const studentId = Number(params.id);

  if (!studentId) {
    return <div>Invalid student ID</div>;
  }
  return <StudentProcess studentId={studentId} />;
};

export default StudentProcessWrapper;

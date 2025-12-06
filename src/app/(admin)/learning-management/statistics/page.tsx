import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";
import LearningProcess from "./StatisticsLearningProcess";

export const metadata: Metadata = {
  title: "Thống kê quá trình học tập - Dictionary",
  description: "Statistics-learning-process page for Dictionary",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon.ico",
        href: "/favicon.ico",
      },
    ],
  },
};

const StatisticsLearningProcess: React.FC = () => {
  return (
    <DefaultLayout>
      <LearningProcess />
    </DefaultLayout>
  );
};

export default StatisticsLearningProcess;

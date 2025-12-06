import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import StudentProcessWrapper from "./StudentProcessWrapper";

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
      <StudentProcessWrapper />
    </DefaultLayout>
  );
};

export default StatisticsLearningProcess;

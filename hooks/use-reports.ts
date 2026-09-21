import { useQuery } from "@tanstack/react-query";
import { getReportCount, getReports } from "@/lib/firebase/reports";
import { getUserCount } from "@/lib/firebase/users";

export const useReports = () => {
  const query = useQuery({
    queryKey: ["reports"],
    queryFn: getReports,
  });
  return {
    reports: query.data ?? [],
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};

export const useAdminStats = () => {
  const users = useQuery({ queryKey: ["user-count"], queryFn: getUserCount });
  const reports = useQuery({ queryKey: ["report-count"], queryFn: getReportCount });
  return {
    userCount: users.data ?? 0,
    reportCount: reports.data ?? 0,
  };
};

import { useEffect, useState } from "react";
import styled from "styled-components";
import type { ActivityLog } from "../../api/studygroup_api";
import { fetchActivityLogs } from "../../api/studygroup_api";
import { useOutletContext } from "react-router-dom";

// 스타일
const ActivityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ActivityItem = styled.div`
  background-color: ${({ theme }) => theme.bgColor};
  border: 1px solid ${({ theme }) => theme.authHoverBgColor};
  padding: 15px 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ActivityContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const LogText = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const LogDate = styled.div`
  font-size: 14px;
  opacity: 0.7;
  color: ${({ theme }) => theme.textColor};
`;

export default function ActivityTab() {
  const { groupId } = useOutletContext<{ groupId: number }>();
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchActivityLogs(groupId);

      const logsArray = [...(data.content ?? [])];

      logsArray.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setLogs(logsArray);
    };
    load();
  }, [groupId]);

  if (logs.length === 0) {
    return <p style={{ opacity: 0.7 }}>활동 기록이 없습니다.</p>;
  }

  return (
    <ActivityContainer>
      {logs.map((log) => (
        <ActivityItem key={log.activityId}>
          <ActivityContent>
            <LogText>
              [{log.type}] {log.userName} — {log.description}
            </LogText>

            <LogDate>{new Date(log.createdAt).toLocaleString()}</LogDate>
          </ActivityContent>
        </ActivityItem>
      ))}
    </ActivityContainer>
  );
}

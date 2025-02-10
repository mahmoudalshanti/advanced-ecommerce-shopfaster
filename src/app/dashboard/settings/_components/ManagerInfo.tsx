"use client";

import { useState } from "react";
import ManagerTabel from "./ManagerTabel";
import AddManager from "./AddManager";

export interface Manager {
  id: string | null;
  email: string | null;
  role: string | null;
  createdAt?: Date;
}

function ManagerInfo({
  countServer,
  pagesServer,
  supervisor,
}: {
  pagesServer?: number;
  countServer?: number;
  supervisor: Manager | null;
}) {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [page, setPage] = useState<number>(1);

  return (
    <div>
      <AddManager
        supervisor={supervisor || { email: "", id: "", role: "" }}
        setManagers={setManagers}
        page={page}
      />
      <ManagerTabel
        page={page}
        setPage={setPage}
        managers={managers}
        setManagers={setManagers}
        countServer={countServer}
        pagesServer={pagesServer}
      />
    </div>
  );
}

export default ManagerInfo;

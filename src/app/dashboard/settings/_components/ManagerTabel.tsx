"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

import React, { useState, useEffect, useCallback } from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  actionDeleteManager,
  actionPaginationTabel,
} from "../../_actions/actionDashboard";
import { Manager } from "./ManagerInfo";
import CustomLoading from "@/components/CustomLoading";

function ManagerTabel({
  pagesServer,
  countServer,
  managers,
  setManagers,
  page,
  setPage,
}: {
  pagesServer?: number;
  countServer?: number;
  managers: Manager[];
  setManagers: React.Dispatch<React.SetStateAction<Manager[]>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}) {
  const [pages, setPages] = useState<number>(pagesServer || 1);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setLoading(true);
        const data = await actionPaginationTabel(page);
        setManagers(data.currentPage || []);
        setPage(data.no);
        setPages(data.pages || 1);
      } catch (error) {
        console.error("Error fetching managers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, [page]);
  const handelDeleteManager = async (email: string) => {
    try {
      setLoadingDelete(true);
      await actionDeleteManager(email);
      setManagers((prevManagers) =>
        prevManagers.filter((manager) => manager.email !== email)
      );
      setLoadingDelete(false);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="mt-10 w-full">
      <p className="text-slate-800 font-semibold mb-1">
        Lists <span className="text-slate-900 font-bold">Manager</span> email
      </p>
      <p className="text-slate-700 font-semibold mb-1 text-sm flex justify-end w-full">
        {countServer} Manager(s) found, pages {pagesServer}
      </p>

      <div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-700 hover:bg-gray-700">
              <TableHead className="w-[100px] text-white">Id</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Role</TableHead>
              <TableHead className="text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  <CustomLoading props="w-12 h-12 border-t-cyan-950 border-slate-300" />
                </TableCell>
              </TableRow>
            ) : managers.length > 0 ? (
              managers.map((manager) => {
                return (
                  <TableRow
                    key={manager.id}
                    className="bg-gray-200 hover:bg-gray-300"
                  >
                    <TableCell className="font-semibold text-black">
                      {manager.id}
                    </TableCell>
                    <TableCell className="text-black">
                      {manager.email}
                    </TableCell>
                    <TableCell className="text-black">{manager.role}</TableCell>
                    <TableCell
                      className="text-black flex items-center cursor-pointer"
                      onClick={() => handelDeleteManager(manager?.email || "")}
                    >
                      {loadingDelete ? (
                        <CustomLoading props="w-5 h-5 border-t-cyan-950 border-slate-300" />
                      ) : (
                        <>
                          <Trash className="text-red-600 size-4 mr-2" />
                          Delete
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  No managers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationTabel
        setPage={setPage}
        page={page}
        pages={pages}
        loading={loading}
      />
    </div>
  );
}

const PaginationTabel = ({
  setPage,
  page,
  pages,
  loading,
}: {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  pages: number;
  loading: boolean;
}) => {
  const handlePrevPage = useCallback(async () => {
    if (page > 1) {
      setPage((prev) => Math.max(1, prev - 1));
    }
  }, [setPage, page]);

  const handleNextPage = useCallback(async () => {
    if (page < pages) {
      setPage((prev) => (prev < pages ? prev + 1 : prev));
    }
  }, [setPage, page, pages]);

  return (
    <Pagination className="mt-10 mb-3">
      <PaginationContent>
        <PaginationItem>
          <Button
            onClick={handlePrevPage}
            className={`bg-gray-700 hover:bg-slate-600 ${
              page === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page === 1 || loading}
          >
            Previous
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="bg-gray-700 hover:bg-gray-700 hover:text-white">
            {page}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Button
            onClick={handleNextPage}
            className={`bg-gray-700 hover:bg-slate-600 ${
              page === pages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={page === pages || loading}
          >
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ManagerTabel;

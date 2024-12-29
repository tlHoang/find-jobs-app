"use client";

import { CardJob } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import {
  getListJobsWithCompany,
  getListJobsWithRecruiter,
} from "@/app/services/jobService";
import { JobListSkeleton } from "../sketetons";
import JobCardClose from "../recruiter/JobCardClose";
import { useAuth } from "@/app/contexts/auth-context";

type CloseJobListProps = {
  recruiterId: string;
};

export default function CloseJobList({ recruiterId }: CloseJobListProps) {
  const [jobs, setJobs] = useState<CardJob[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    if (recruiterId === "") {
      getListJobsWithCompany(user?.userId || "", "CLOSE")
        .then((data) => {
          setJobs(data);
        })
        .catch((err) => {
          console.log("Error fetching jobs:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      getListJobsWithRecruiter(recruiterId, "CLOSE")
        .then((data) => {
          setJobs(data);
        })
        .catch((err) => {
          console.log("Error fetching jobs:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [recruiterId]);

  const handleDeleteJob = (id: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
  };

  if (loading) {
    return <JobListSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-3 gap-4">
      {jobs.map((job, index) => {
        return (
          <JobCardClose
            key={index}
            id={job.id}
            title={job.title}
            company={job.companyName}
            salaryMin={job.salary.min}
            salaryMax={job.salary.max}
            currency={job.salary.currency}
            city={job.location.city}
            address={job.location.address}
            employmentType={job.employmentType}
            numberApplicants={job.numberApplicant}
            onDelete={handleDeleteJob}
          />
        );
      })}
    </div>
  );
}

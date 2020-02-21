import React from "react";
import {TimestampToMoment} from "src/util/convert";
import {jobHasOneOfStatuses} from "src/views/jobs/jobStatusOptions";
import {
  formatDuration,
  JOB_STATUS_PAUSED,
  JOB_STATUS_PENDING,
  JOB_STATUS_RUNNING,
  JOB_STATUS_SUCCEEDED,
} from "src/views/jobs/index";
import _ from "lodash";
import moment from "moment";
import Job = cockroach.server.serverpb.JobsResponse.IJob;
import {cockroach} from "src/js/protos";

export class Duration extends React.PureComponent<{ job: Job }> {
  render() {
    const started = TimestampToMoment(this.props.job.started);
    const finished = TimestampToMoment(this.props.job.finished);
    const modified = TimestampToMoment(this.props.job.modified);
    if (jobHasOneOfStatuses(this.props.job, JOB_STATUS_PENDING, JOB_STATUS_PAUSED)) {
      return _.capitalize(this.props.job.status);
    } else if (jobHasOneOfStatuses(this.props.job, JOB_STATUS_RUNNING)) {
      const fractionCompleted = this.props.job.fraction_completed;
      if (fractionCompleted > 0) {
        const duration = modified.diff(started);
        const remaining = duration / fractionCompleted - duration;
        return <span
          className="jobs-table__duration--right">{formatDuration(moment.duration(remaining)) + " remaining"}</span>;
      }
    } else if (jobHasOneOfStatuses(this.props.job, JOB_STATUS_SUCCEEDED)) {
      return "Duration: " + formatDuration(moment.duration(finished.diff(started)));
    }
  }
}

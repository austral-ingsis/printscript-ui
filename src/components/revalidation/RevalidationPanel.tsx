import {useEffect, useState} from "react";
import {Alert, Box, Button, Card, LinearProgress, MenuItem, Select, Typography} from "@mui/material";
import {useGetFileTypes, useGetRevalidation, useStartRevalidation} from "../../utils/queries.tsx";
import {RevalidationRun} from "../../utils/snippetOperations.ts";
import {queryClient} from "../../App.tsx";

const LANGUAGE = "printscript";

/** Revalidates every snippet against a version of the language, e.g. after a new parser release. */
const RevalidationPanel = () => {
  const {data: fileTypes} = useGetFileTypes();
  const versions = fileTypes?.find((f) => f.language === LANGUAGE)?.versions ?? [];
  const [version, setVersion] = useState<string>("");
  const [runId, setRunId] = useState<string | undefined>(undefined);
  const [finished, setFinished] = useState(false);

  const {mutate: start, isLoading: starting, error: startError} = useStartRevalidation();
  const {data: run} = useGetRevalidation(runId, !finished);

  useEffect(() => {
    if (run?.status === "COMPLETED") {
      setFinished(true);
      queryClient.invalidateQueries("listSnippets");
    }
  }, [run?.status]);

  const handleStart = () => {
    setFinished(false);
    start({language: LANGUAGE, version}, {
      onSuccess: (started: RevalidationRun) => setRunId(started.id),
    });
  };

  const progress = run && run.total > 0 ? (run.processed / run.total) * 100 : 100;

  return (
    <Card style={{padding: 16, margin: 16}}>
      <Typography variant={"h6"}>Revalidate snippets</Typography>
      <Box display="flex" gap={2} alignItems="center" mt={2}>
        <Select size="small" value={version} displayEmpty sx={{minWidth: 160}}
                onChange={(e) => setVersion(e.target.value)}>
          <MenuItem value="" disabled>Choose a version</MenuItem>
          {versions.map((v) => (
            <MenuItem key={v} value={v}>{v}</MenuItem>
          ))}
        </Select>
        <Button variant={"contained"} disabled={!version || starting || (!!run && run.status === "RUNNING")}
                onClick={handleStart}>
          Revalidate
        </Button>
      </Box>
      {startError && <Alert severity="error" sx={{mt: 2}}>{startError.message}</Alert>}
      {run && (
        <Box mt={2}>
          <LinearProgress variant="determinate" value={progress}/>
          <Typography mt={1}>
            {run.status === "COMPLETED" ? "Finished" : "Running"}: {run.processed} of {run.total} processed
            {run.failed > 0 ? `, ${run.failed} could not be revalidated` : ""}
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default RevalidationPanel;

import React from "react";
import {
  Box,
  Grid,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import MimeIcon from "./MimeIcon";
import { humanReadableSize } from "./app/utils";

export interface FileItem {
  key: string;
  size: number;
  uploaded: string;
  httpMetadata: { contentType: string };
  customMetadata?: { thumbnail?: string };
}

function extractFilename(key: string) {
  return key.split("/").pop();
}

export function encodeKey(key: string) {
  return key.split("/").map(encodeURIComponent).join("/");
}

export function isDirectory(file: FileItem) {
  return file.httpMetadata?.contentType === "application/x-directory";
}

function isImage(contentType?: string) {
  return contentType?.startsWith("image/");
}

function FileGrid({
  files,
  onCwdChange,
  multiSelected,
  onMultiSelect,
  emptyMessage,
}: {
  files: FileItem[];
  onCwdChange: (newCwd: string) => void;
  multiSelected: string[] | null;
  onMultiSelect: (key: string) => void;
  emptyMessage?: React.ReactNode;
}) {
  return files.length === 0 ? (
    emptyMessage
  ) : (
    <Box
      sx={{
        maxHeight: "100vh",
        overflowY: "auto",
        scrollBehavior: "smooth",
        backgroundColor: "#0a0e1a",
        p: 2,
        fontFamily: '"Share Tech Mono", monospace',
        color: "#8be9fd",
      }}
    >
      <Grid container spacing={2}>
        {files.map((file) => {
          const isImg = isImage(file.httpMetadata.contentType);
          const previewSrc = file.customMetadata?.thumbnail
            ? `/webdav/_$flaredrive$/thumbnails/${file.customMetadata.thumbnail}.png`
            : isImg
            ? `/webdav/${encodeKey(file.key)}`
            : null;

          return (
            <Grid item key={file.key} xs={12} sm={6} md={4} lg={3} xl={2}>
              <Box
                sx={{
                  border: "1px solid #00caff",
                  background: "linear-gradient(to bottom, #0e1a2b, #08111f)",
                  borderRadius: "8px",
                  boxShadow: "0 0 12px #00e5ff66",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 0 18px #00ffffaa",
                  },
                  overflow: "hidden",
                }}
              >
                <ListItemButton
                  selected={multiSelected?.includes(file.key)}
                  onClick={() => {
                    if (multiSelected !== null) {
                      onMultiSelect(file.key);
                    } else if (isDirectory(file)) {
                      onCwdChange(file.key + "/");
                    } else {
                      window.open(
                        `/webdav/${encodeKey(file.key)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onMultiSelect(file.key);
                  }}
                  sx={{
                    userSelect: "none",
                    flexDirection: "column",
                    alignItems: "stretch",
                    padding: 0,
                  }}
                >
                  {previewSrc ? (
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        backgroundColor: "#06101a",
                        overflow: "hidden",
                        position: "relative",
                      }}
                    >
                      <Box
                        component="img"
                        src={previewSrc}
                        alt={extractFilename(file.key)}
                        loading="lazy"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          filter: "brightness(0.8) contrast(1.1)",
                        }}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#07111e",
                      }}
                    >
                      <MimeIcon
                        contentType={file.httpMetadata.contentType}
                        sx={{
                          fontSize: 48,
                          color: "#00eaff",
                          filter: "drop-shadow(0 0 4px #00eaff88)",
                        }}
                      />
                    </Box>
                  )}

                  <Box
                    sx={{
                      px: 1,
                      py: 1.5,
                      textAlign: "center",
                      borderTop: "1px solid #00caff44",
                      backgroundColor: "#0e1a2b",
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        fontSize: "0.9rem",
                        color: "#8be9fd",
                        textShadow: "0 0 4px #00eaff55",
                      }}
                    >
                      {extractFilename(file.key)}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#44e0ffaa",
                        fontSize: "0.75rem",
                      }}
                    >
                      {new Date(file.uploaded).toLocaleString()}
                      {!isDirectory(file)
                        ? ` • ${humanReadableSize(file.size)}`
                        : ""}
                    </Typography>
                  </Box>
                </ListItemButton>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default FileGrid;

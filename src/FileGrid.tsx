import React from "react";
import { Box, Grid, ListItemButton, ListItemText } from "@mui/material";
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
    <Grid
      container
      spacing={2}
      sx={{
        padding: 3,
        backgroundColor: "#0b0f1a",
        minHeight: "100vh",
        fontFamily: "'Orbitron', monospace",
      }}
    >
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
                border: "2px dashed #00ffe7",
                borderRadius: "8px",
                boxShadow: "0 0 10px #00ffe7",
                backgroundColor: "#101526",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.02)",
                  boxShadow: "0 0 20px #00ffe7",
                },
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
                      height: 220,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#18233a",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={previewSrc}
                      alt={extractFilename(file.key)}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: "contrast(1.2) brightness(1.1)",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 220,
                      backgroundColor: "#141a29",
                      color: "#00ffe7",
                    }}
                  >
                    <MimeIcon contentType={file.httpMetadata.contentType} />
                  </Box>
                )}

                <Box sx={{ p: 1 }}>
                  <ListItemText
                    primary={extractFilename(file.key)}
                    primaryTypographyProps={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: "#00ffe7",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                    secondary={
                      <React.Fragment>
                        <Box
                          sx={{
                            display: "inline-block",
                            marginRight: 1,
                            fontSize: "0.75rem",
                            color: "#87fff7",
                          }}
                        >
                          {new Date(file.uploaded).toLocaleString()}
                        </Box>
                        {!isDirectory(file) && (
                          <Box
                            component="span"
                            sx={{ fontSize: "0.75rem", color: "#38f9d7" }}
                          >
                            {" — " + humanReadableSize(file.size)}
                          </Box>
                        )}
                      </React.Fragment>
                    }
                  />
                </Box>
              </ListItemButton>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default FileGrid;

import React from "react";
import {
  Box,
  Grid,
  ListItemButton,
  // ListItemIcon,
  ListItemText,
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
    <Grid
      container
      spacing={2}
      sx={{
        paddingBottom: "48px",
        paddingSide: "24px",
        backgroundColor: "#253a8dff",
        minHeight: "100vh",
        fontFamily: "Star Wars, consolas, monospace",
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
                border: 3,
                borderColor: "#54c0cb",
                borderStyle: "dashed",
                backgroundColor: "#293c8aff",
                color: "#54c0cb",
                borderRadius: 0,
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
                      height: 220,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#4a90e2",
                      color: "#54c0cb",
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
                        backgroundColor: "#c5d4f1ff",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "inline-block",
                      minWidth: "300px",
                      marginRight: 1,
                      fontFamily: "'Star Wars', consolas, monospace",
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
                    }}
                    secondary={
                      <React.Fragment>
                        <Box
                          sx={{
                            display: "inline-block",
                            minWidth: "300px",
                            marginRight: 1,
                          }}
                        >
                          {new Date(file.uploaded).toLocaleString()}
                        </Box>
                        {!isDirectory(file) && humanReadableSize(file.size)}
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

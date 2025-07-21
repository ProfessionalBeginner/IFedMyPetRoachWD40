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
    <Grid container spacing={2} sx={{ paddingBottom: "48px" }}>
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
                border: 1,
                borderColor: "divider",
                borderRadius: 1,
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
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e3f2fd", // soft light blue
                      minHeight: 100,
                      maxHeight: 400,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      component="img"
                      src={previewSrc}
                      alt={extractFilename(file.key)}
                      sx={{
                        maxWidth: "100%",
                        maxHeight: 400,
                        width: "auto",
                        height: "auto",
                        display: "block",
                        margin: "auto",
                        backgroundColor: "transparent",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      minHeight: 100,
                      maxHeight: 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#e3f2fd", // soft light blue
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

<script>
  import {
    Database,
    File,
    FileAudio,
    FileCode,
    FileImage,
    FileJson,
    FileText,
    FileType,
    FileVideo,
    Folder,
    FolderOpen,
  } from "lucide-svelte";
  import { expandedFolders } from "$lib/stores/fileStore.js";

  export let node;

  $: isExpanded = node.isDirectory && $expandedFolders.has(node.path);

  function getExtension(filename) {
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
  }

  function getFileIcon(node) {
    if (node.isDirectory) {
      return isExpanded ? FolderOpen : Folder;
    }

    const ext = getExtension(node.name);

    if (
      [
        "js",
        "ts",
        "jsx",
        "tsx",
        "vue",
        "svelte",
        "py",
        "rb",
        "php",
        "java",
        "c",
        "cpp",
        "h",
        "cs",
        "go",
        "rs",
        "swift",
        "kt",
      ].includes(ext)
    ) {
      return FileCode;
    }

    if (["json", "yaml", "yml", "toml", "xml"].includes(ext)) {
      return FileJson;
    }

    if (
      ["txt", "md", "markdown", "rst", "doc", "docx", "pdf", "rtf"].includes(
        ext,
      )
    ) {
      return FileText;
    }

    if (
      ["jpg", "jpeg", "png", "gif", "svg", "webp", "ico", "bmp"].includes(ext)
    ) {
      return FileImage;
    }

    if (["mp4", "avi", "mov", "mkv", "webm", "flv"].includes(ext)) {
      return FileVideo;
    }

    if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(ext)) {
      return FileAudio;
    }

    if (["db", "sqlite", "sqlite3", "sql"].includes(ext)) {
      return Database;
    }

    if (["ttf", "otf", "woff", "woff2", "eot"].includes(ext)) {
      return FileType;
    }

    return File;
  }

  function getIconColor(node) {
    if (node.isDirectory) {
      return "text-yellow-500";
    }

    const ext = getExtension(node.name);

    if (["js", "jsx"].includes(ext)) return "text-yellow-400";
    if (["ts", "tsx"].includes(ext)) return "text-blue-400";
    if (["svelte"].includes(ext)) return "text-orange-500";
    if (["vue"].includes(ext)) return "text-green-400";
    if (["py"].includes(ext)) return "text-blue-300";
    if (["json"].includes(ext)) return "text-yellow-300";
    if (["md", "markdown"].includes(ext)) return "text-gray-300";
    if (["html", "htm"].includes(ext)) return "text-orange-400";
    if (["css", "scss", "sass"].includes(ext)) return "text-pink-400";
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(ext))
      return "text-purple-400";

    return "text-gray-400";
  }

  $: IconComponent = getFileIcon(node);
  $: iconColor = getIconColor(node);
</script>

<div class="flex items-center gap-2 min-w-0">
  <svelte:component
    this="{IconComponent}"
    size="{16}"
    class="{iconColor + ' flex-shrink-0'}"
  />
  <span class="truncate text-on-surface">{node.name}</span>
</div>

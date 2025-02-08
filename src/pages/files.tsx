import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Folder,
  File,
  MoreVertical,
  Plus,
  Upload,
  Download,
  Pencil,
  Trash2,
  ChevronLeft,
  FolderOpen,
  LayoutGrid,
  List,
} from 'lucide-react';
import { toast } from 'sonner';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modifiedAt: string;
  parentId: string | null;
}

const initialFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    modifiedAt: '2024-03-20',
    parentId: null,
  },
  {
    id: '2',
    name: 'Contracts',
    type: 'folder',
    modifiedAt: '2024-03-19',
    parentId: null,
  },
  {
    id: '3',
    name: 'Performance Reviews',
    type: 'folder',
    modifiedAt: '2024-03-18',
    parentId: null,
  },
  {
    id: '4',
    name: 'Annual Review 2023.pdf',
    type: 'file',
    size: '2.5 MB',
    modifiedAt: '2024-03-15',
    parentId: null,
  },
  {
    id: '5',
    name: 'Employee Handbook.pdf',
    type: 'file',
    size: '1.8 MB',
    modifiedAt: '2024-03-10',
    parentId: null,
  },
];

export function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentFiles = files.filter((file) => file.parentId === currentFolder);
  const currentPath = getCurrentPath(currentFolder, files);

  function getCurrentPath(folderId: string | null, files: FileItem[]): FileItem[] {
    const path: FileItem[] = [];
    let currentId = folderId;

    while (currentId) {
      const folder = files.find((f) => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }

    return path;
  }

  const handleCreateFolder = () => {
    if (!newItemName.trim()) return;

    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: newItemName,
      type: 'folder',
      modifiedAt: new Date().toISOString().split('T')[0],
      parentId: currentFolder,
    };

    setFiles([...files, newFolder]);
    setNewItemName('');
    setIsCreatingFolder(false);
    toast.success('Folder created successfully');
  };

  const handleRename = () => {
    if (!selectedItem || !newItemName.trim()) return;

    setFiles(
      files.map((file) =>
        file.id === selectedItem.id ? { ...file, name: newItemName } : file
      )
    );
    setNewItemName('');
    setIsRenaming(false);
    setSelectedItem(null);
    toast.success('Item renamed successfully');
  };

  const handleDelete = (item: FileItem) => {
    const itemsToDelete = [item.id];
    if (item.type === 'folder') {
      const findChildren = (parentId: string) => {
        files.forEach((file) => {
          if (file.parentId === parentId) {
            itemsToDelete.push(file.id);
            if (file.type === 'folder') {
              findChildren(file.id);
            }
          }
        });
      };
      findChildren(item.id);
    }

    setFiles(files.filter((file) => !itemsToDelete.includes(file.id)));
    toast.success('Item deleted successfully');
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const newFiles: FileItem[] = Array.from(uploadedFiles).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: 'file',
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      modifiedAt: new Date().toISOString().split('T')[0],
      parentId: currentFolder,
    }));

    setFiles([...files, ...newFiles]);
    toast.success('Files uploaded successfully');
  };

  const renderListView = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Modified</TableHead>
          <TableHead>Size</TableHead>
          <TableHead className="w-[70px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {currentFolder && (
          <TableRow
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => {
              const parentFolder = files.find((f) => f.id === currentFolder);
              setCurrentFolder(parentFolder?.parentId || null);
            }}
          >
            <TableCell>
              <div className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span>..</span>
              </div>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        )}
        {currentFiles.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  if (item.type === 'folder') {
                    setCurrentFolder(item.id);
                  }
                }}
              >
                {item.type === 'folder' ? (
                  <FolderOpen className="h-4 w-4 text-blue-500" />
                ) : (
                  <File className="h-4 w-4 text-gray-500" />
                )}
                {item.name}
              </div>
            </TableCell>
            <TableCell>{item.modifiedAt}</TableCell>
            <TableCell>{item.size || '--'}</TableCell>
            <TableCell>
              <FileActions item={item} onDelete={handleDelete} onRename={() => {
                setSelectedItem(item);
                setNewItemName(item.name);
                setIsRenaming(true);
              }} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {currentFolder && (
        <div
          className="p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
          onClick={() => {
            const parentFolder = files.find((f) => f.id === currentFolder);
            setCurrentFolder(parentFolder?.parentId || null);
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <ChevronLeft className="h-8 w-8" />
            <span className="text-sm font-medium">..</span>
          </div>
        </div>
      )}
      {currentFiles.map((item) => (
        <div
          key={item.id}
          className="group relative p-4 rounded-lg border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
        >
          <div
            className="flex flex-col items-center gap-2"
            onClick={() => {
              if (item.type === 'folder') {
                setCurrentFolder(item.id);
              }
            }}
          >
            {item.type === 'folder' ? (
              <FolderOpen className="h-12 w-12 text-blue-500" />
            ) : (
              <File className="h-12 w-12 text-gray-500" />
            )}
            <span className="text-sm font-medium text-center line-clamp-2">{item.name}</span>
            <span className="text-xs text-muted-foreground">{item.size || '--'}</span>
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <FileActions item={item} onDelete={handleDelete} onRename={() => {
              setSelectedItem(item);
              setNewItemName(item.name);
              setIsRenaming(true);
            }} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Files</h2>
          <div className="flex items-center space-x-2 text-muted-foreground">
            <button
              onClick={() => setCurrentFolder(null)}
              className="hover:text-foreground"
            >
              Root
            </button>
            {currentPath.map((folder, index) => (
              <div key={folder.id} className="flex items-center">
                <span>/</span>
                <button
                  onClick={() => setCurrentFolder(folder.id)}
                  className="px-2 hover:text-foreground"
                >
                  {folder.name}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </Button>

          <Dialog open={isCreatingFolder} onOpenChange={setIsCreatingFolder}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Folder name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateFolder} className="w-full">
                  Create Folder
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="relative">
            <Input
              type="file"
              multiple
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleUpload}
            />
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <div className="p-4">
          {viewMode === 'list' ? renderListView() : renderGridView()}
        </div>
      </div>

      <Dialog open={isRenaming} onOpenChange={(open) => {
        setIsRenaming(open);
        if (!open) setSelectedItem(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                placeholder="New name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
            </div>
            <Button onClick={handleRename} className="w-full">
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FileActions({ item, onDelete, onRename }: { 
  item: FileItem; 
  onDelete: (item: FileItem) => void;
  onRename: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={(e) => {
          e.preventDefault();
          onRename();
        }}>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </DropdownMenuItem>
        {item.type === 'file' && (
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Download
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
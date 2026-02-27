import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateLightscribeProject, useUpdateLightscribeProject } from '../hooks/useQueries';
import { ExternalBlob, type LightscribeLabelProject } from '../backend';
import LightscribeCanvas, { type CanvasElement } from './LightscribeCanvas';
import { toast } from 'sonner';
import { Download, Save } from 'lucide-react';

type LightscribeProjectDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistId: string;
  existingProject?: LightscribeLabelProject;
};

export default function LightscribeProjectDialog({
  open,
  onOpenChange,
  artistId,
  existingProject,
}: LightscribeProjectDialogProps) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isSaving, setIsSaving] = useState(false);

  const createProject = useCreateLightscribeProject();
  const updateProject = useUpdateLightscribeProject();

  useEffect(() => {
    if (existingProject) {
      setProjectName(existingProject.projectName);
      setDescription(existingProject.description);
      try {
        const canvasData = JSON.parse(existingProject.canvasData);
        setElements(canvasData.elements || []);
        setBackgroundColor(canvasData.backgroundColor || '#ffffff');
      } catch {
        setElements([]);
      }
    } else {
      setProjectName('');
      setDescription('');
      setElements([]);
      setBackgroundColor('#ffffff');
    }
  }, [existingProject, open]);

  const generatePreviewImage = async (): Promise<Uint8Array<ArrayBuffer>> => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, 400, 400);

    // Draw CD outline
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(200, 200, 180, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw center hole
    ctx.beginPath();
    ctx.arc(200, 200, 30, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw elements
    for (const element of elements) {
      if (element.type === 'text') {
        ctx.font = `${element.fontSize || 24}px ${element.fontFamily || 'Arial'}`;
        ctx.fillStyle = element.color || '#000000';
        ctx.fillText(element.content, element.x, element.y);
      } else if (element.type === 'image' && element.content) {
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, element.x, element.y, element.width || 100, element.height || 100);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = element.content;
        });
      }
    }

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/png');
    });
    const arrayBuffer = await blob.arrayBuffer();
    return new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
  };

  const generateLightscribeFiles = async () => {
    // Generate LSA file (simple XML format)
    const lsaContent = `<?xml version="1.0" encoding="UTF-8"?>
<lightscribe version="1.0">
  <label>
    <name>${projectName}</name>
    <description>${description}</description>
    <backgroundColor>${backgroundColor}</backgroundColor>
    <elements>
      ${elements
        .map(
          (el) => `
      <element type="${el.type}" x="${el.x}" y="${el.y}">
        ${el.type === 'text' ? `<text fontSize="${el.fontSize}" fontFamily="${el.fontFamily}" color="${el.color}">${el.content}</text>` : ''}
        ${el.type === 'image' ? `<image width="${el.width}" height="${el.height}" src="${el.content}" />` : ''}
      </element>`
        )
        .join('')}
    </elements>
  </label>
</lightscribe>`;

    const lsaBlob = new TextEncoder().encode(lsaContent) as Uint8Array<ArrayBuffer>;

    // Generate LSS file (script format)
    const lssContent = `# Lightscribe Label Script
# Project: ${projectName}
# Description: ${description}

SET BACKGROUND ${backgroundColor}

${elements
  .map((el) => {
    if (el.type === 'text') {
      return `TEXT "${el.content}" AT ${el.x},${el.y} FONT "${el.fontFamily}" SIZE ${el.fontSize} COLOR ${el.color}`;
    } else if (el.type === 'image') {
      return `IMAGE "${el.content}" AT ${el.x},${el.y} SIZE ${el.width}x${el.height}`;
    }
    return '';
  })
  .join('\n')}

RENDER
`;

    const lssBlob = new TextEncoder().encode(lssContent) as Uint8Array<ArrayBuffer>;

    return { lsaBlob, lssBlob };
  };

  const handleSave = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    setIsSaving(true);
    try {
      const previewImageBytes = await generatePreviewImage();
      const { lsaBlob, lssBlob } = await generateLightscribeFiles();

      const canvasData = JSON.stringify({ elements, backgroundColor });
      const layerData = JSON.stringify({ layers: elements.map((el, i) => ({ id: el.id, zIndex: i })) });
      const metadata = JSON.stringify({ version: '1.0', created: Date.now() });

      const project: LightscribeLabelProject = {
        id: existingProject?.id || `project-${Date.now()}`,
        artistId,
        projectName,
        description,
        canvasData,
        layerData,
        metadata,
        createdTimestamp: existingProject?.createdTimestamp || BigInt(Date.now() * 1000000),
        modifiedTimestamp: BigInt(Date.now() * 1000000),
        previewImage: ExternalBlob.fromBytes(previewImageBytes),
        labelScriptFile: ExternalBlob.fromBytes(lssBlob),
        lsaFile: ExternalBlob.fromBytes(lsaBlob),
        lssFile: ExternalBlob.fromBytes(lssBlob),
        printableImage: ExternalBlob.fromBytes(previewImageBytes),
        exportHistory: existingProject?.exportHistory || [],
      };

      if (existingProject) {
        await updateProject.mutateAsync(project);
        toast.success('Project updated successfully');
      } else {
        await createProject.mutateAsync(project);
        toast.success('Project created successfully');
      }

      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async (format: 'lsa' | 'lss' | 'png') => {
    try {
      if (format === 'png') {
        const imageBytes = await generatePreviewImage();
        const blob = new Blob([imageBytes], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName || 'label'}.png`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const { lsaBlob, lssBlob } = await generateLightscribeFiles();
        const blob = new Blob([format === 'lsa' ? lsaBlob : lssBlob], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectName || 'label'}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error('Failed to export file');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{existingProject ? 'Edit' : 'Create'} CD Label Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="My CD Label"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Album artwork for..."
              />
            </div>
          </div>

          <LightscribeCanvas
            elements={elements}
            onChange={setElements}
            backgroundColor={backgroundColor}
            onBackgroundColorChange={setBackgroundColor}
          />
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport('png')} size="sm">
              <Download className="mr-2 h-4 w-4" />
              PNG
            </Button>
            <Button variant="outline" onClick={() => handleExport('lsa')} size="sm">
              <Download className="mr-2 h-4 w-4" />
              LSA
            </Button>
            <Button variant="outline" onClick={() => handleExport('lss')} size="sm">
              <Download className="mr-2 h-4 w-4" />
              LSS
            </Button>
          </div>
          <div className="flex gap-2 sm:ml-auto">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Project'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

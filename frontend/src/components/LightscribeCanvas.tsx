import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Type, Image as ImageIcon, Palette, Download, Trash2 } from 'lucide-react';

export type CanvasElement = {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  content: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  width?: number;
  height?: number;
};

type LightscribeCanvasProps = {
  elements: CanvasElement[];
  onChange: (elements: CanvasElement[]) => void;
  backgroundColor?: string;
  onBackgroundColorChange?: (color: string) => void;
};

export default function LightscribeCanvas({
  elements,
  onChange,
  backgroundColor = '#ffffff',
  onBackgroundColorChange,
}: LightscribeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const CANVAS_SIZE = 400;
  const CD_DIAMETER = 360;
  const CENTER_HOLE = 60;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw CD outline
    const centerX = CANVAS_SIZE / 2;
    const centerY = CANVAS_SIZE / 2;

    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, CD_DIAMETER / 2, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw center hole
    ctx.beginPath();
    ctx.arc(centerX, centerY, CENTER_HOLE / 2, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw elements
    elements.forEach((element) => {
      if (element.type === 'text') {
        ctx.font = `${element.fontSize || 24}px ${element.fontFamily || 'Arial'}`;
        ctx.fillStyle = element.color || '#000000';
        ctx.fillText(element.content, element.x, element.y);

        // Highlight selected element
        if (selectedElement === element.id) {
          const metrics = ctx.measureText(element.content);
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 2;
          ctx.strokeRect(element.x - 2, element.y - (element.fontSize || 24) - 2, metrics.width + 4, (element.fontSize || 24) + 4);
        }
      } else if (element.type === 'image' && element.content) {
        const img = new Image();
        img.src = element.content;
        img.onload = () => {
          ctx.drawImage(img, element.x, element.y, element.width || 100, element.height || 100);
          
          // Highlight selected element
          if (selectedElement === element.id) {
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 2;
            ctx.strokeRect(element.x - 2, element.y - 2, (element.width || 100) + 4, (element.height || 100) + 4);
          }
        };
      }
    });
  }, [elements, selectedElement, backgroundColor]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find clicked element
    const clickedElement = elements.find((el) => {
      if (el.type === 'text') {
        const ctx = canvas.getContext('2d');
        if (!ctx) return false;
        ctx.font = `${el.fontSize || 24}px ${el.fontFamily || 'Arial'}`;
        const metrics = ctx.measureText(el.content);
        return (
          x >= el.x &&
          x <= el.x + metrics.width &&
          y >= el.y - (el.fontSize || 24) &&
          y <= el.y
        );
      } else if (el.type === 'image') {
        return (
          x >= el.x &&
          x <= el.x + (el.width || 100) &&
          y >= el.y &&
          y <= el.y + (el.height || 100)
        );
      }
      return false;
    });

    if (clickedElement) {
      setSelectedElement(clickedElement.id);
      setDragOffset({ x: x - clickedElement.x, y: y - clickedElement.y });
    } else {
      setSelectedElement(null);
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedElement) {
      setIsDragging(true);
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    const updatedElements = elements.map((el) =>
      el.id === selectedElement ? { ...el, x, y } : el
    );
    onChange(updatedElements);
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const addTextElement = () => {
    const newElement: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: CANVAS_SIZE / 2 - 50,
      y: CANVAS_SIZE / 2,
      content: 'New Text',
      fontSize: 24,
      fontFamily: 'Arial',
      color: '#000000',
    };
    onChange([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const addImageElement = (imageUrl: string) => {
    const newElement: CanvasElement = {
      id: `image-${Date.now()}`,
      type: 'image',
      x: CANVAS_SIZE / 2 - 50,
      y: CANVAS_SIZE / 2 - 50,
      content: imageUrl,
      width: 100,
      height: 100,
    };
    onChange([...elements, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElement) return;
    const updatedElements = elements.map((el) =>
      el.id === selectedElement ? { ...el, ...updates } : el
    );
    onChange(updatedElements);
  };

  const deleteSelectedElement = () => {
    if (!selectedElement) return;
    onChange(elements.filter((el) => el.id !== selectedElement));
    setSelectedElement(null);
  };

  const selectedElementData = elements.find((el) => el.id === selectedElement);

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4">
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="w-full cursor-pointer rounded-lg border-2 border-border"
              onClick={handleCanvasClick}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Tabs defaultValue="elements">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="elements">Elements</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
          </TabsList>

          <TabsContent value="elements" className="space-y-4">
            <Card>
              <CardContent className="space-y-4 p-4">
                <div>
                  <h3 className="mb-2 font-semibold">Add Elements</h3>
                  <div className="flex gap-2">
                    <Button onClick={addTextElement} className="flex-1">
                      <Type className="mr-2 h-4 w-4" />
                      Add Text
                    </Button>
                    <Button
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              addImageElement(event.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="flex-1"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Templates</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => addImageElement('/assets/generated/cd-template-modern.dim_400x400.png')}
                      className="overflow-hidden rounded-lg border-2 border-border transition-all hover:border-primary"
                    >
                      <img src="/assets/generated/cd-template-modern.dim_400x400.png" alt="Modern" className="h-full w-full object-cover" />
                    </button>
                    <button
                      onClick={() => addImageElement('/assets/generated/cd-template-vintage.dim_400x400.png')}
                      className="overflow-hidden rounded-lg border-2 border-border transition-all hover:border-primary"
                    >
                      <img src="/assets/generated/cd-template-vintage.dim_400x400.png" alt="Vintage" className="h-full w-full object-cover" />
                    </button>
                    <button
                      onClick={() => addImageElement('/assets/generated/cd-template-minimal.dim_400x400.png')}
                      className="overflow-hidden rounded-lg border-2 border-border transition-all hover:border-primary"
                    >
                      <img src="/assets/generated/cd-template-minimal.dim_400x400.png" alt="Minimal" className="h-full w-full object-cover" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            {selectedElementData ? (
              <Card>
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Element Properties</h3>
                    <Button variant="destructive" size="sm" onClick={deleteSelectedElement}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedElementData.type === 'text' && (
                    <>
                      <div className="space-y-2">
                        <Label>Text Content</Label>
                        <Input
                          value={selectedElementData.content}
                          onChange={(e) => updateSelectedElement({ content: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Font Size: {selectedElementData.fontSize || 24}px</Label>
                        <Slider
                          value={[selectedElementData.fontSize || 24]}
                          onValueChange={([value]) => updateSelectedElement({ fontSize: value })}
                          min={12}
                          max={72}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Font Family</Label>
                        <Select
                          value={selectedElementData.fontFamily || 'Arial'}
                          onValueChange={(value) => updateSelectedElement({ fontFamily: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Courier New">Courier New</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={selectedElementData.color || '#000000'}
                            onChange={(e) => updateSelectedElement({ color: e.target.value })}
                            className="h-10 w-20"
                          />
                          <Input
                            value={selectedElementData.color || '#000000'}
                            onChange={(e) => updateSelectedElement({ color: e.target.value })}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {selectedElementData.type === 'image' && (
                    <>
                      <div className="space-y-2">
                        <Label>Width: {selectedElementData.width || 100}px</Label>
                        <Slider
                          value={[selectedElementData.width || 100]}
                          onValueChange={([value]) => updateSelectedElement({ width: value })}
                          min={50}
                          max={300}
                          step={10}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Height: {selectedElementData.height || 100}px</Label>
                        <Slider
                          value={[selectedElementData.height || 100]}
                          onValueChange={([value]) => updateSelectedElement({ height: value })}
                          min={50}
                          max={300}
                          step={10}
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex min-h-[200px] items-center justify-center p-4">
                  <p className="text-muted-foreground">Select an element to edit its properties</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="background" className="space-y-4">
            <Card>
              <CardContent className="space-y-4 p-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => onBackgroundColorChange?.(e.target.value)}
                      className="h-10 w-20"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => onBackgroundColorChange?.(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Quick Colors</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map((color) => (
                      <button
                        key={color}
                        onClick={() => onBackgroundColorChange?.(color)}
                        className="h-10 w-10 rounded-lg border-2 border-border transition-all hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

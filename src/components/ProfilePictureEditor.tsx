"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Slider } from "primereact/slider";

// size of the saved picture in pixels, small enough to store on the user document
const SIZE = 256;

interface Props {
  visible: boolean;
  currentPicture?: string;
  onHide: () => void;
  onSave: (picture: string) => Promise<void>;
}

// image size after rotation and the scale that makes it cover the canvas
function getDrawSize(img: HTMLImageElement, rotation: number, zoom: number) {
  const turned = rotation % 2 === 1;
  const w = turned ? img.height : img.width;
  const h = turned ? img.width : img.height;
  const scale = Math.max(SIZE / w, SIZE / h) * zoom;
  return { w, h, scale };
}

// keeps the image covering the whole canvas while panning
function clampOffset(x: number, y: number, img: HTMLImageElement, rotation: number, zoom: number) {
  const { w, h, scale } = getDrawSize(img, rotation, zoom);
  const maxX = (w * scale - SIZE) / 2;
  const maxY = (h * scale - SIZE) / 2;
  return {
    x: Math.min(maxX, Math.max(-maxX, x)),
    y: Math.min(maxY, Math.max(-maxY, y)),
  };
}

function loadImage(src: string, onLoad: (img: HTMLImageElement) => void, onError: () => void) {
  const img = new Image();
  img.onload = () => onLoad(img);
  img.onerror = onError;
  img.src = src;
}

// The profile page only mounts this while it is open, so every opening starts with fresh state.

export default function ProfilePictureEditor({
  visible,
  currentPicture,
  onHide,
  onSave,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // number of 90° turns
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  // the Dialog mounts the canvas a bit later, so redraw once it is shown
  const [shownCount, setShownCount] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#f3e8ff";
    ctx.fillRect(0, 0, SIZE, SIZE);
    if (!image) return;

    const { scale } = getDrawSize(image, rotation, zoom);
    const pos = clampOffset(offset.x, offset.y, image, rotation, zoom);
    ctx.save();
    ctx.translate(SIZE / 2 + pos.x, SIZE / 2 + pos.y);
    ctx.rotate((rotation * Math.PI) / 2);
    ctx.drawImage(
      image,
      (-image.width * scale) / 2,
      (-image.height * scale) / 2,
      image.width * scale,
      image.height * scale
    );
    ctx.restore();
  }, [image, zoom, rotation, offset, shownCount]);

  // start from the current picture
  useEffect(() => {
    if (currentPicture)
      loadImage(currentPicture, setImage, () => setError("Can't load this image."));
  }, [currentPicture]);

  function resetEditor() {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
    setError("");
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("The image must be smaller than 10 MB.");
      return;
    }
    resetEditor();
    const reader = new FileReader();
    reader.onload = () =>
      loadImage(reader.result as string, setImage, () => setError("Can't load this image."));
    reader.readAsDataURL(file);
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!image) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!image || !dragStart.current) return;
    // the canvas may be displayed smaller than its real size
    const ratio = SIZE / e.currentTarget.clientWidth;
    const dx = (e.clientX - dragStart.current.x) * ratio;
    const dy = (e.clientY - dragStart.current.y) * ratio;
    dragStart.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => clampOffset(o.x + dx, o.y + dy, image, rotation, zoom));
  }

  function handlePointerUp() {
    dragStart.current = null;
  }

  async function save(picture: string) {
    setSaving(true);
    try {
      await onSave(picture);
      onHide();
    } catch (err) {
      console.log(err);
      setError("Can't save the picture.");
    } finally {
      setSaving(false);
    }
  }

  const footer = (
    <div className="flex flex-row justify-between gap-2">
      <Button
        label="Remove"
        icon="pi pi-trash"
        severity="danger"
        text
        disabled={!currentPicture || saving}
        onClick={() => save("")}
      />
      <div className="flex flex-row gap-2">
        <Button label="Cancel" text onClick={onHide} disabled={saving} />
        <Button
          label="Save"
          icon="pi pi-check"
          loading={saving}
          disabled={!image}
          onClick={() =>
            canvasRef.current &&
            save(canvasRef.current.toDataURL("image/jpeg", 0.85))
          }
        />
      </div>
    </div>
  );

  return (
    <Dialog
      header="Edit profile picture"
      visible={visible}
      onHide={onHide}
      onShow={() => setShownCount((c) => c + 1)}
      footer={footer}
      className="w-[95vw] max-w-md"
      draggable={false}
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={SIZE}
            height={SIZE}
            className={`w-64 max-w-full aspect-square rounded-full shadow-md ring-4 ring-purple-200 touch-none ${
              image ? "cursor-move" : ""
            }`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
          {!image && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-400 pointer-events-none">
              <i className="pi pi-image" style={{ fontSize: "2.5rem" }} />
              <span className="mt-2 text-sm">No picture yet</span>
            </div>
          )}
        </div>

        {image && (
          <p className="text-sm text-gray-500 -mt-2">Drag the picture to position it</p>
        )}

        <div className="w-full flex flex-row items-center gap-3">
          <i className="pi pi-search-minus text-gray-500" />
          <Slider
            value={zoom * 100}
            min={100}
            max={300}
            onChange={(e) => setZoom((e.value as number) / 100)}
            disabled={!image}
            className="flex-1"
          />
          <i className="pi pi-search-plus text-gray-500" />
        </div>

        <div className="flex flex-row gap-2">
          <Button
            label="Upload image"
            icon="pi pi-upload"
            outlined
            onClick={() => fileInputRef.current?.click()}
          />
          <Button
            icon="pi pi-refresh"
            outlined
            tooltip="Rotate"
            tooltipOptions={{ position: "bottom" }}
            disabled={!image}
            onClick={() => {
              setRotation((r) => (r + 1) % 4);
              setOffset({ x: 0, y: 0 });
            }}
          />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>
    </Dialog>
  );
}

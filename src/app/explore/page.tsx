"use client";

import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import * as d3 from "d3";
import { Vector3 } from "three";

interface Point {
  x: number;
  y: number;
  z: number;
}

const CenterSphere = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <circleGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color={"#F8CF57"} />
    </mesh>
  );
};

const Box = ({ position }: { position: [number, number, number] }) => {
  return (
    <mesh position={position}>
      <circleGeometry args={[0.03, 32]} />
      <meshStandardMaterial color={"#475DC5"} />
    </mesh>
  );
};

const Map = ({ data }: { data: Point[] }) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.setX(0);
    camera.position.setY(-3);
    camera.position.setZ(2);
  }, []);

  return (
    <>
      <ambientLight intensity={1} />
      <pointLight position={[0, 0, 10]} />
      <OrbitControls enableRotate={false} />
      <CenterSphere />
      {data.map((point: Point, index: number) => (
        <Box key={index} position={[point.x, point.y, point.z]} />
      ))}
    </>
  );
};

const Explore = () => {
  const [data, setData] = useState<Point[]>([]);

  useEffect(() => {
    d3.csv("/coordinates.csv")
      .then((data) => {
        const parsedData = data.map((d) => ({
          x: +d.x / 2000,
          y: +d.y / 1333,
          z: +d.z,
        }));
        setData(parsedData);
      })
      .catch((error) => {
        console.error("Error loading or parsing CSV file:", error);
      });
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <Canvas>
        <Map data={data} />
      </Canvas>
    </div>
  );
};

export default Explore;

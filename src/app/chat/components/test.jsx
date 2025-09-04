"use client";
import React from "react";

export default function Test() {
  return (
    <div>
      <p>ver-1 : 배포 테스트 1</p>
      <p>ver-2 : 배포 테스트 2</p>
      <p>ver-3 : 배포 테스트 3</p>
      <p>ver-4 : Elastic Beanstalk 어플리케이션 및 환경 설정 재구성</p>
      <p>ver-5 : EC2 인스턴스 프로파일(aws-elasticbeanstalk-ec2-role)에 AmazonEC2ContainerRegistryReadOnly 권한 추가</p>
      <p>ver-6 : ElasticBeanstalk 환경 구성에서 인스턴스 크기 변경 t3.small를 t3.medium로 변경</p>
      <p>ver-7 : ElasticBeanstalk 환경 구성에서 VPC 퍼블릭 IP 주소를 true로 활성화</p>
      <p>ver-8 : docker 이미지 최적화 작업</p>
    </div>
  );
}


provider "aws" {
  region = "ap-northeast-1"
}

resource "aws_vpc" "demo_app_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "demo-app-vpc"
  }
}
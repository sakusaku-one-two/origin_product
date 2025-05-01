
provider "aws" {
    region = "ap-northeast-1"
}


resource "aws_vpc" "demo_app_vpc" {
    cidr_block = "10.0.0.0/16"
    enable_dns_support = true
    enable_dns_hostnames = true
    tags = {
        Name = "demo_app_vpc"
    }
}

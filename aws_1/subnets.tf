
variable "subnet_az" {
  type = list(string)
  default = ["ap-northeast-1a","ap-northeast-1c"]
}

resource "aws_subnet" "demo_app_public_subnet" {
  count = length(var.subnet_az)
  vpc_id = aws_vpc.demo_app_vpc.id
  availability_zone = var.subnet_az[count.index]
  cidr_block = "10.0.${count.index *3  + 1}.0/24"
  tags = {
    Name = "demo-app-public-subnet-${count.index + 1}"
  }
}

resource "aws_subnet" "demo_app_dmz_subnet" {
  count = length(var.subnet_az)
  vpc_id = aws_vpc.demo_app_vpc.id
  availability_zone = var.subnet_az[count.index]
  cidr_block = "10.0.${count.index *3  + 2}.0/24"
  tags = {
    Name = "demo-app-dmz-subnet-${count.index + 1}"
  }
}

resource "aws_subnet" "demo_app_private_subnet" {
  count = length(var.subnet_az)
  vpc_id = aws_vpc.demo_app_vpc.id
  availability_zone = var.subnet_az[count.index]
  cidr_block = "10.0.${count.index *3  + 3}.0/24"
  tags = {
    Name = "demo-app-private-subnet-${count.index + 1}"
  }
}
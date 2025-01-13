
resource "aws_internet_gateway" "demo_app_igw" {
  vpc_id = aws_vpc.demo_app_vpc.id
  tags = {
    Name = "demo-app-igw"
  }
}

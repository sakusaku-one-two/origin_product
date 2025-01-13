

resource "aws_route_table" "demo_app_public_route_table" {
  vpc_id = aws_vpc.demo_app_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.demo_app_igw.id
  }
}

resource "aws_route_table_association" "demo_app_public_route_table_association" {
  count = length(var.subnet_az)
  subnet_id = aws_subnet.demo_app_public_subnet[count.index].id
  route_table_id = aws_route_table.demo_app_public_route_table.id
  
}

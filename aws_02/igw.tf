
resource "aws_internet_gateway" "demo_app_igw" {
    vpc_id = aws_vpc.demo_app_vpc.id
    tags = {
        Name = "demo_app_igw"
    }
}

resource "aws_route_table" "demo_app_route_table" {
    vpc_id = aws_vpc.demo_app_vpc.id
    tags = {
        Name = "demo_app_route_table"
    }
}

resource "aws_route" "demo_app_route_igw" {
    route_table_id = aws_route_table.demo_app_route_table.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.demo_app_igw.id
}

resource "aws_route_table_association" "demo_app_route_table_association" {
    subnet_id = aws_subnet.demo_app_public_subnet.id
    route_table_id = aws_route_table.demo_app_route_table.id
}

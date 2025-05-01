resource "aws_nat_gateway" "demo_app_nat_gateway" {
    allocation_id = aws_eip.demo_app_nat_eip.id
    subnet_id = aws_subnet.demo_app_public_subnet[0].id
}

resource "aws_route_table" "demo_app_private_route_table" {
    vpc_id = aws_vpc.demo_app_vpc.id
}

resource "aws_route" "demo_app_nat_gateway_route" {
    route_table_id = aws_route_table.demo_app_private_route_table.id
    destination_cidr_block = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.demo_app_nat_gateway.id
}

resource "aws_route_table_association" "demo_app_dmz_subnet_association" {
    count = length(aws_subnet.demo_app_dmz_subnet)
    subnet_id = aws_subnet.demo_app_dmz_subnet[count.index].id
    route_table_id = aws_route_table.demo_app_private_route_table.id
}

resource "aws_route_table_association" "demo_app_private_subnet_association" {
    count = length(aws_subnet.demo_app_private_subnet)
    subnet_id = aws_subnet.demo_app_private_subnet[count.index].id
    route_table_id = aws_route_table.demo_app_private_route_table.id
}




resource "aws_subnet" "demo_app_public_subnet" {
    vpc_id = aws_vpc.demo_app_vpc.id
    availability_zone = "ap-northeast-1a"
    cidr_block = "10.0.0.0/24"
    map_public_ip_on_launch = true
    tags = {
        Name = "demo_app_public_subnet"
    }
}


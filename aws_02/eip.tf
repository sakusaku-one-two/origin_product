resource "aws_eip" "demo_app_eip" {
    tags = {
        Name = "demo_app_eip"
    }
}

resource "aws_eip_association" "demo_app_eip_association" {
    instance_id = aws_instance.demo_app_ec2.id 
    allocation_id = aws_eip.demo_app_eip.id
    allow_reassociation = true
}
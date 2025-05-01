

resource "aws_lb" "demo_app_lb" {
    name = "demo_app_lb"
    subnets = [aws_subnet.demo_app_public_subnet.id]
}

resource "aws_lb_target_group" "demo_app_lb_target_group" {
    name = "demo_app_lb_target_group"
    port = 80
    protocol = "HTTP"
    vpc_id = aws_vpc.demo_app_vpc.id
}

resource "aws_lb_listener" "demo_app_lb_listener" {
    load_balancer_arn = aws_lb.demo_app_lb.arn
    port = 80
    protocol = "HTTP"
    default_action {
        type = "forward"
        target_group_arn = aws_lb_target_group.demo_app_lb_target_group.arn
    }
}


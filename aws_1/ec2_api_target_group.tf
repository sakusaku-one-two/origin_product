

resource "aws_lb_target_group" "demo_app_api_target_group" {
  name = "demo-app-api-target-group"
  port = 80
  protocol = "HTTP"
  vpc_id = aws_vpc.demo_app_vpc.id
  target_type = "instance"
  tags = {
    Name = "demo-app-api-target-group"
  }
  health_check {
    path = "/health"
    port = "traffic-port"
    protocol = "HTTP"
    healthy_threshold = 3
    unhealthy_threshold = 2
    timeout = 5
    interval = 30
  }
  depends_on = [aws_instance.demo_app_nginx]
}

resource "aws_lb_target_group_attachment" "demo_app_api_target_group_attachment" {
  target_group_arn = aws_lb_target_group.demo_app_api_target_group.arn
  target_id = aws_instance.demo_app_nginx.id
  port = 80
}



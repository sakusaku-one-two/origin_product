

resource "aws_lb_target_group" "demo_app_nginx_tg" {
    name = "demo-app-nginx-tg"
    port = 80
    protocol = "HTTP"
    vpc_id = aws_vpc.demo_app_vpc.id
    target_type = "instance"
}

resource "aws_lb_target_group_attachment" "demo_app_nginx_tg_attachment" {
    target_group_arn = aws_lb_target_group.demo_app_nginx_tg.arn
    target_id = aws_instance.demo_app_nginx.id
    port = 80
}
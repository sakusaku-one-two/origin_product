resource "aws_lb_target_group" "demo_app_nginx_tg" {
    name = "demo-app-nginx-tg"
    port = 80
    protocol = "HTTP"
    vpc_id = aws_vpc.demo_app_vpc.id
    target_type = "instance"
    health_check {
        path = "/"
        port = "traffic-port"
        protocol = "HTTP"
        healthy_threshold = 3
    }
}

resource "aws_lb_target_group_attachment" "demo_app_nginx_tg_attachment" {
    target_group_arn = aws_lb_target_group.demo_app_nginx_tg.arn
    target_id = aws_instance.demo_app_nginx.id
    port = 80
}

resource "aws_lb_listener" "demo_app_nginx_lis" {
    load_balancer_arn = aws_lb.demo_app_lb_next.arn
    port = 443
    protocol = "HTTPS"
    ssl_policy = "ELBSecurityPolicy-TLS13-1-2-Res-2021-06"
    certificate_arn = aws_acm_certificate.demo_app_certificate.arn
    default_action {
        type = "forward"
        target_group_arn = aws_lb_target_group.demo_app_nginx_tg.arn
    }
}
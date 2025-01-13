
resource "aws_lb" "demo_app_lb" {
    name = "demo-app-lb"
    internal = false
    load_balancer_type = "application"
    subnets = [aws_subnet.demo_app_public_subnet[0].id,aws_subnet.demo_app_public_subnet[1].id]
    security_groups = [aws_security_group.demo_app_api_security_group.id]
    
    
}




resource "aws_lb_listener" "demo_app_lb_listener" {
    load_balancer_arn = aws_lb.demo_app_lb.arn
    port = 80
    protocol = "HTTP"

    default_action {
        type = "redirect"
        redirect {
            protocol = "HTTPS"
            port  = "443"
            status_code = "HTTP_301"
        }
    }
}

resource "aws_lb_listener" "demo_app_lb_listener_https" {
    load_balancer_arn = aws_lb.demo_app_lb.arn
    port = 443
    protocol = "HTTPS"
    ssl_policy = "ELBSecurityPolicy-TLS13-1-2-Res-2021-06"
    certificate_arn = aws_acm_certificate.demo_app_certificate.arn

    default_action {
        type = "forward"
        target_group_arn = aws_lb_target_group.demo_app_api_target_group.arn
    }
}
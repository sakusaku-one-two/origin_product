
data "aws_route53_zone" "demo_app_zone_next" {
    name = "sakusaku-demo-app.com"
}

resource "aws_route53_record" "demo_app_dns_next" {
    zone_id = data.aws_route53_zone.demo_app_zone_next.zone_id
    name = "demo-app.sakusaku-demo-app.com"
    type = "A"
    
    alias {
        name = aws_lb.demo_app_lb_next.dns_name
        zone_id = aws_lb.demo_app_lb_next.zone_id
        evaluate_target_health = true
    }
}



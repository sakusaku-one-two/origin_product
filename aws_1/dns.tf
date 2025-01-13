
data "aws_route53_zone" "demo_app_zone" {
    name = "sakusaku-demo-app.com"
}


resource "aws_route53_record" "demo_app_dns" {
    zone_id = data.aws_route53_zone.demo_app_zone.zone_id
    name = "www.sakusaku-demo-app.com"
    type = "A"

    alias {
        name = aws_lb.demo_app_lb.dns_name
        zone_id = aws_lb.demo_app_lb.zone_id
        evaluate_target_health = true
    }
}
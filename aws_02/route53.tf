
data "aws_route53_zone" "demo_app_zone" {
    name = "*.sakusaku-demo-app.com"
}

resource "aws_route53_record" "demo_app_dns" {
    zone_id = data.aws_route53_zone.demo_app_zone.zone_id
    name = "demo-app.sakusaku-demo-app.com"
    type = "A"
    
    ttl = 300
    records = [aws_ecs_service.demo_app_ecs_service.load_balancer[0].dns_name]
}



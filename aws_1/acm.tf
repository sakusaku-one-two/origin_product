resource "aws_acm_certificate" "demo_app_certificate" {
  domain_name       = "*.sakusaku-demo-app.com"
  validation_method = "DNS"

  tags = {
    Name = "demo-app-certificate"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "demo_app_certificate_validation" {
  for_each = {
    for dvo in aws_acm_certificate.demo_app_certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = aws_route53_zone.demo_app_zone.zone_id
  name    = each.value.name
  type    = each.value.type
  records = [each.value.record]
  ttl     = 60
}

resource "aws_acm_certificate_validation" "demo_app_certificate_validation" {
  certificate_arn         = aws_acm_certificate.demo_app_certificate.arn
  validation_record_fqdns = [for record in aws_route53_record.demo_app_certificate_validation : record.fqdn]
}



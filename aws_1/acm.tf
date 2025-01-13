

resource "aws_acm_certificate" "demo_app_certificate" {
    domain_name = "*.sakusaku-demo-app.com"
    validation_method = "DNS"
}

resource "aws_acm_certificate_validation" "demo_app_certificate_validation" {
    certificate_arn = aws_acm_certificate.demo_app_certificate.arn
    validation_record_fqdns = [aws_route53_record.demo_app_dns.fqdn]
}




resource "aws_ecs_task_definition" "db_2" {
  family                   = "db-2"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "db-2"
      image     = "${aws_ecr_repository.db_2.repository_url}:latest"
      essential = true
      command   = ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
      environment = [
        { name = "POSTGRES_USER", value = "MY_USER" },
        { name = "POSTGRES_PASSWORD", value = "SAKUSAKU" },
        { name = "POSTGRES_DB", value = "ORIGINAL_PROJECTS" }
      ]
      mountPoints = [
        {
          sourceVolume  = "original-project_db-data"
          containerPath = "/var/lib/postgresql/data"
        }
      ]
    }
  ])

  volume {
    name = "original-project_db-data"
    efs_volume_configuration {
      file_system_id = aws_efs_file_system.db_efs.id
    }
  }
}

resource "aws_ecs_task_definition" "api" {
  family                   = "api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "api"
      image     = "${aws_ecr_repository.api.repository_url}:latest"
      essential = true
      environment = [
        { name = "JWT_SECRET_KEY", value = "SAKUSAKU" },
        { name = "DB_HOST", value = "db-2" },
        { name = "DB_PORT", value = "5432" },
        { name = "DB_USER", value = "MY_USER" },
        { name = "DB_PASSWORD", value = "SAKUSAKU" },
        { name = "DB_NAME", value = "ORIGINAL_PROJECTS" },
        { name = "DB_SSL", value = "disable" },
        { name = "DB_TIMEZONE", value = "Asia/Tokyo" }
      ]
    }
  ])
}

resource "aws_ecs_task_definition" "nginx" {
  family                   = "nginx"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"

  container_definitions = jsonencode([
    {
      name      = "nginx"
      image     = "${aws_ecr_repository.nginx.repository_url}:latest"
      essential = true
      portMappings = [
        {
          containerPort = 443
          hostPort      = 443
        }
      ]
    }
  ])
}

resource "aws_ecs_service" "db_2_service" {
  name            = "db-2-service"
  cluster         = aws_ecs_cluster.demo_app_ecs_cluster.id
  task_definition = aws_ecs_task_definition.db_2.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.demo_app_public_subnet.id]
    security_groups = [aws_security_group.demo_app_sg.id]
    assign_public_ip = true
  }
}

resource "aws_ecs_service" "api_service" {
  name            = "api-service"
  cluster         = aws_ecs_cluster.demo_app_ecs_cluster.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.demo_app_public_subnet.id]
    security_groups = [aws_security_group.demo_app_sg.id]
    assign_public_ip = true
  }
}

resource "aws_ecs_service" "nginx_service" {
  name            = "nginx-service"
  cluster         = aws_ecs_cluster.demo_app_ecs_cluster.id
  task_definition = aws_ecs_task_definition.nginx.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets         = [aws_subnet.demo_app_public_subnet.id]
    security_groups = [aws_security_group.demo_app_sg.id]
    assign_public_ip = true
  }
}
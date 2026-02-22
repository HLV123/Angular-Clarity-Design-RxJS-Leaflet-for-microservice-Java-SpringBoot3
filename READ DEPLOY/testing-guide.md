# Testing Guide

---

## Test Pyramid

```
         ╱  E2E  ╲           5%   Cypress / Playwright
        ╱  Tests  ╲
       ╱───────────╲
      ╱ Integration ╲       20%   Testcontainers, MockMvc
     ╱    Tests      ╲
    ╱─────────────────╲
   ╱    Unit Tests     ╲    70%   JUnit 5, Jasmine, pytest
  ╱─────────────────────╲
 ╱   Static Analysis     ╲   5%   SonarQube, ESLint, mypy
╱─────────────────────────╲
```

---

## Coverage Targets

| Layer | Target | Tool |
|-------|--------|------|
| Java Service logic | >= 80% | JaCoCo |
| Java Controller | >= 70% | JaCoCo |
| Angular Components | >= 60% | Istanbul (Karma) |
| Angular Services | >= 80% | Istanbul |
| Python ML Models | >= 70% | coverage.py |
| gRPC contracts | 100% | Handwritten |

---

## Java (Spring Boot)

### Unit Tests (JUnit 5 + Mockito)

```java
@ExtendWith(MockitoExtension.class)
class PatientServiceImplTest {

    @Mock PatientRepository repo;
    @Mock KafkaTemplate<String, Object> kafka;
    @InjectMocks PatientServiceImpl service;

    @Test
    void should_returnPatient_when_existsById() {
        Patient entity = new Patient("P-001", "Nguyễn Văn An");
        when(repo.findById("P-001")).thenReturn(Optional.of(entity));

        PatientDTO result = service.getPatient("P-001");

        assertThat(result.getFullName()).isEqualTo("Nguyễn Văn An");
        verify(repo).findById("P-001");
    }

    @Test
    void should_throwNotFound_when_patientMissing() {
        when(repo.findById("P-999")).thenReturn(Optional.empty());

        assertThrows(PatientNotFoundException.class,
            () -> service.getPatient("P-999"));
    }
}
```

### Integration Tests (Testcontainers)

```java
@SpringBootTest
@Testcontainers
class PatientControllerIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.6.0"));

    @Autowired MockMvc mockMvc;

    @Test
    void should_createPatient_and_publishEvent() throws Exception {
        String json = """
            {"fullName":"Test Patient","dob":"1990-01-01","gender":"Nam","phone":"0901000099"}
            """;

        mockMvc.perform(post("/api/v1/patients")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists());

        // Verify Kafka event
        ConsumerRecord<String, String> record = KafkaTestUtils.getSingleRecord(consumer, "patient.created");
        assertThat(record.value()).contains("Test Patient");
    }
}
```

### Run

```bash
mvn test                              # Unit tests
mvn verify                            # Unit + Integration
mvn verify -Djacoco.check=true        # With coverage check
```

---

## Angular (Jasmine + Karma)

### Component Test

```typescript
describe('PatientsComponent', () => {
  let component: PatientsComponent;
  let fixture: ComponentFixture<PatientsComponent>;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    apiService = jasmine.createSpyObj('ApiService', ['getPatients']);
    apiService.getPatients.and.returnValue(of(MOCK_PATIENTS));

    await TestBed.configureTestingModule({
      imports: [PatientsComponent],
      providers: [{ provide: ApiService, useValue: apiService }]
    }).compileComponents();

    fixture = TestBed.createComponent(PatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load patients on init', () => {
    expect(component.patients().length).toBe(10);
  });

  it('should filter by search term', () => {
    component.searchTerm.set('Nguyễn');
    expect(component.filteredPatients().every(p => p.fullName.includes('Nguyễn'))).toBeTrue();
  });
});
```

### Run

```bash
ng test                               # Watch mode
ng test --no-watch --code-coverage    # CI mode + coverage
```

---

## Python (pytest)

### ML Model Test

```python
import pytest
from app.models.symptom_checker import SymptomChecker

class TestSymptomChecker:
    @pytest.fixture
    def checker(self):
        return SymptomChecker(model_path="tests/fixtures/test_model.h5")

    def test_should_return_top5_predictions(self, checker):
        result = checker.check("Đau ngực, khó thở, vã mồ hôi")
        assert len(result.suggestions) <= 5
        assert all(0 <= s.probability <= 1 for s in result.suggestions)

    def test_should_include_icd10_codes(self, checker):
        result = checker.check("Sốt, ho, đau họng")
        assert all(s.icd10_code.startswith(("J", "A", "B")) for s in result.suggestions)

    def test_should_handle_empty_input(self, checker):
        with pytest.raises(ValueError):
            checker.check("")
```

### Run

```bash
cd ml-service
pytest                                # All tests
pytest --cov=app --cov-report=html    # With coverage
```

---

## E2E (Cypress)

```bash
npm install -g cypress
npx cypress run                       # Headless
npx cypress open                      # GUI
```

Key E2E scenarios:
- Login với 6 roles → verify sidebar menu khác nhau
- Patient CRUD flow
- Drug interaction check → warning popup
- Realtime vital charts update
- Alert acknowledge flow
